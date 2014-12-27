var _ = require('lodash');
var copy = require('shallow-copy');

var getBlankScores = function getBlankScores(candidates){
 
   var blankScores = {};
       _.each(candidates,function(candidate){
          blankScores[candidate] = 0; 
    });
       return copy(blankScores);
};

function condercet(P){

     var sumMatrix = P.dominanceMatrix;
     var pairwise = [];
     var numToName = _.invert(P.candidateMap);
     for(var i=0;i < sumMatrix.length; i++){
        pairwise[i] = [];
	for(var j=0;j < sumMatrix.length;j++){
		pairwise[i].push(sumMatrix[i][j] - sumMatrix[j][i]);	 
        }
     }    

 var isVoteDeltaPositive = function isVoteDeltaPositive(voteDiff){
     return voteDiff >= 0;
 };

 var mapToScoringObjects = function mapToScoringObjects(candidate,index){
    return {
             "name": numToName[index],
	     "winner": _.every(candidate,isVoteDeltaPositive)
           };

 };
     
    return _.chain(pairwise)
               .map(mapToScoringObjects)
               .filter(function(candidate){ return candidate.winner;})
	       .pluck("name")
	       .value();
}


module.exports =  function black(P){
 
     var bordaScores = getBlankScores(P.candidates);
     var condercetScores = getBlankScores(P.candidates);

     P.each(function(obj,val,i){
                       bordaScores[val] += ((P.candidates.length - i) * obj.numVotes);
                    });
		    
   

     var condercetWinners = condercet(P);

      _.each(condercetWinners, function(winner){
         condercetScores[winner] = 1;
	 });

	return _.isEmpty(condercetWinners) ? bordaScores : condercetScores;  
         

    };
