// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NadzToken.sol";

contract NadzTokenFactory {
    address public owner;
    address payable public feeRecipient;
    uint256 public feeAmount;
    
    address[] public deployedTokens;
    mapping(address => bool) public isDeployedToken;
    
    event TokenCreated(
        address indexed token,
        address indexed creator,
        address indexed owner,
        string name,
        string symbol,
        uint256 totalSupply
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

    function createToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address tokenOwner
    ) external payable returns (address) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length >= 2 && bytes(symbol).length <= 6, "Symbol must be 2-6 characters");
        require(totalSupply > 0, "Total supply must be greater than 0");
        require(tokenOwner != address(0), "Invalid token owner");
        require(msg.value == feeAmount, "Incorrect fee");

        // Transfer fee to fee recipient
        if (feeAmount > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // Deploy new token
        NadzToken newToken = new NadzToken(name, symbol, totalSupply, tokenOwner);
        address tokenAddress = address(newToken);
        
        deployedTokens.push(tokenAddress);
        isDeployedToken[tokenAddress] = true;

        emit TokenCreated(tokenAddress, msg.sender, tokenOwner, name, symbol, totalSupply);
        
        return tokenAddress;
    }

    function getDeployedTokensCount() external view returns (uint256) {
        return deployedTokens.length;
    }

    function getDeployedToken(uint256 index) external view returns (address) {
        require(index < deployedTokens.length, "Index out of bounds");
        return deployedTokens[index];
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(msg.sender, amount), "Withdraw failed");
    }

    function withdrawNative(uint256 amount) external onlyOwner {
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

