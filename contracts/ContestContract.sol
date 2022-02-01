pragma solidity >=0.5.0 <0.7.0;

// ZKP package used as-is from: https://github.com/18dew/solGrined
import './ZKP/PedersenContract.sol';

contract ContestContract {
   address public minter;
   address public pedersenAddr;
   uint public startDate;
   uint public endDate;
   string public problemUri;
   string public dataUri;

   struct Submission { 
      uint256 firstCommit;
      uint256 secondCommit;
      uint32 benchmark;
      bool validated;
   }

   mapping (address => Submission) public submissions;
   
   constructor(address pedAddr, uint contestStart, uint contestEnd, string memory problem, string memory data) public {
      minter = msg.sender;
      pedersenAddr = pedAddr;
      startDate = contestStart;
      endDate = contestEnd;
      problemUri = problem;
      dataUri = data;
   }

   function submit(uint256 firstCommit, uint256 secondCommit, uint32 benchmark) public {
      if(block.number < startDate || block.number > endDate) {
         revert();
      }
      else {
         Submission memory submission = Submission(firstCommit, secondCommit, benchmark, false);
         submissions[msg.sender] = submission;
      }
   }

   function validate(address addr, uint256 r, uint256 v) public {
      PedersenContract pedersen = PedersenContract(pedersenAddr);
      submissions[addr].validated = pedersen.verify(r, v, submissions[addr].firstCommit, submissions[addr].secondCommit);
   }

   function status() public view returns ( uint32 benchmark, bool validated ) {
      Submission memory submission = submissions[msg.sender];
      (benchmark, validated) = (submission.benchmark, submission.validated);
   }

}