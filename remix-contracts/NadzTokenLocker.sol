// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract NadzTokenLocker {
    struct Lock {
        address token;
        uint256 amount;
        uint256 withdrawn;
        uint256 lockUntil;
        address owner;
    }

    address public owner;
    address payable public feeRecipient;
    uint256 public feeAmount;
    uint256 public nextLockId;
    
    mapping(uint256 => Lock) public locks;
    mapping(address => uint256[]) public locksOf;
    
    event Locked(
        uint256 indexed lockId,
        address indexed owner,
        address indexed token,
        uint256 amount,
        uint256 lockUntil
    );
    event Withdrawn(
        uint256 indexed lockId,
        address indexed owner,
        uint256 amount
    );
    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address payable _feeRecipient, uint256 _feeAmount) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        owner = msg.sender;
        feeRecipient = _feeRecipient;
        feeAmount = _feeAmount;
        nextLockId = 1;
    }

    function setFeeAmount(uint256 _feeAmount) external onlyOwner {
        feeAmount = _feeAmount;
        emit FeeUpdated(_feeAmount);
    }

    function setFeeRecipient(address payable _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }

    function lock(
        address token,
        uint256 amount,
        uint256 lockUntil
    ) external payable {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount must be greater than 0");
        require(lockUntil > block.timestamp, "Lock until must be in the future");
        require(msg.value == feeAmount, "Incorrect fee");

        // Transfer fee to fee recipient
        if (feeAmount > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // Transfer tokens from user to contract
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer from failed");

        // Create lock
        uint256 lockId = nextLockId;
        locks[lockId] = Lock({
            token: token,
            amount: amount,
            withdrawn: 0,
            lockUntil: lockUntil,
            owner: msg.sender
        });
        
        // Add to user's lock list
        locksOf[msg.sender].push(lockId);
        
        nextLockId++;

        emit Locked(lockId, msg.sender, token, amount, lockUntil);
    }

    function withdraw(uint256 lockId) external {
        Lock storage lockInfo = locks[lockId];
        require(lockInfo.owner == msg.sender, "Not lock owner");
        require(block.timestamp >= lockInfo.lockUntil, "Lock not yet unlocked");
        
        uint256 available = withdrawable(lockId);
        require(available > 0, "No tokens available to withdraw");

        lockInfo.withdrawn += available;
        
        require(IERC20(lockInfo.token).transfer(msg.sender, available), "Transfer failed");
        
        emit Withdrawn(lockId, msg.sender, available);
    }

    function withdrawable(uint256 lockId) public view returns (uint256) {
        Lock memory lockInfo = locks[lockId];
        
        if (lockInfo.amount == 0) {
            return 0; // Lock doesn't exist
        }
        
        if (block.timestamp < lockInfo.lockUntil) {
            return 0; // Lock not yet unlocked
        }
        
        uint256 remaining = lockInfo.amount - lockInfo.withdrawn;
        return remaining;
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(msg.sender, amount), "Withdraw failed");
    }

    function withdrawNative(uint256 amount) external onlyOwner {
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }
    
    function getUserLocks(address user) external view returns (uint256[] memory) {
        return locksOf[user];
    }
}

