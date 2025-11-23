// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

contract NadzMultiSend {
    address public owner;
    address payable public feeRecipient;
    uint256 public feeAmount;

    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);
    event MultiSendNative(address indexed sender, uint256 recipientCount, uint256 totalAmount);
    event MultiSendToken(address indexed sender, address indexed token, uint256 recipientCount, uint256 totalAmount);

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

    function multiSendNative(address[] calldata recipients, uint256[] calldata amounts) external payable {
        require(recipients.length > 0, "No recipients");
        require(recipients.length == amounts.length, "Mismatched arrays");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            totalAmount += amounts[i];
        }
        
        require(msg.value >= totalAmount + feeAmount, "Insufficient value");
        
        if (feeAmount > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }
        
        uint256 excess = msg.value - totalAmount - feeAmount;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit MultiSendNative(msg.sender, recipients.length, totalAmount);
    }

    function multiSend(address[] calldata recipients, uint256[] calldata amounts) external payable {
        multiSendNative(recipients, amounts);
    }

    function multiSendToken(address token, address[] calldata recipients, uint256[] calldata amounts) external payable {
        require(token != address(0), "Invalid token");
        require(recipients.length > 0, "No recipients");
        require(recipients.length == amounts.length, "Mismatched arrays");
        require(msg.value == feeAmount, "Incorrect fee");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            totalAmount += amounts[i];
        }
        
        if (feeAmount > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        require(IERC20(token).transferFrom(msg.sender, address(this), totalAmount), "Transfer from failed");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(IERC20(token).transfer(recipients[i], amounts[i]), "Token transfer failed");
        }
        
        emit MultiSendToken(msg.sender, token, recipients.length, totalAmount);
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(msg.sender, amount), "Withdraw failed");
    }

    function withdrawNative(uint256 amount) external onlyOwner {
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }
}

