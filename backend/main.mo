import Nat "mo:core/Nat";

actor {
  var highScore = 0;

  public shared ({ caller }) func submitScore(finalScore : Nat) : async Bool {
    if (finalScore > highScore) {
      highScore := finalScore;
      return true;
    };
    false;
  };

  public query ({ caller }) func getHighScore() : async Nat {
    highScore;
  };
};
