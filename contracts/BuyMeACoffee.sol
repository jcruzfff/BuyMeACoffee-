//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//Deployed to Goerli at 0x0dF3c4C28096A9e387Dc52c261DF16088971248C

error tipper_NotOwner();

contract BuyMeACoffee {
    //Event to emit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all memos received from friends
    Memo[] memos;

    //Address of contract deployer.
    address payable owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert tipper_NotOwner();
        _;
    }

    //Deploy logic
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */

    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");

        //Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //Emit a log event when a new memo us created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function buylargeCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");

        //Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //Emit a log event when a new memo us created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stred in the contract to the owner
     */
    function withdrawTips() public onlyOwner {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
