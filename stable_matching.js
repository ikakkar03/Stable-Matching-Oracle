//generateInput(n: number): number[][]
function generateInput(n) {
    let input = [];
    for (let i = 0; i < n; ++i) {
      let pref = [];
      for (let p = 0; p < n; ++p) {
        let num = randomInt(0,n);
        while (pref.includes(num)) {num = randomInt(0,n)}
        pref.push(num);
      }
      input.push(pref);
    }
    return input;
  }
  //randomInt(min: number, max:number): number 
  function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
  }
  
  //oracle(f: (companies: number[][], candidates: number[][]) => Hire[]): void
  function oracle(f) {
    let numTests = 100;
    for (let i = 0; i < numTests; ++i) {
      let n = 3;
      let companies = generateInput(n);
      let candidates = generateInput(n);
      let hires = f(companies,candidates);
  
      test("Hires length is correct", function() {
        assert(companies.length === hires.length); //checking number of matches. Should be equal to num of companies/candidates
      });
  
      test("preferences are within range",function() {
        assert(companies.every(c => c.every(p => p >= 0 && p < n)));
        assert(candidates.every(c => c.every(p => p >=0 && p < n)));
      });
  
      test("preferences are not decimals",function() {
        assert(companies.every(c => c.every(p => p%1 === 0)));
        assert(candidates.every(c => c.every(p => p%1 === 0)));
      });
  
      test("all companies are matched correctly",function() {
        let companiesMatched = [];
        hires.forEach(h => companiesMatched.push(h.company));
        assert(companiesMatched.length === n); //not more than total number of companies are matched. Also checks if a company is matched with more than one candidate
        assert(companiesMatched.every(c => companiesMatched.indexOf(c) === companiesMatched.lastIndexOf(c)));//no duplicates. A company should not be matched with more than 1 candidate
        assert([0,1,2].every(cNum => companiesMatched.includes(cNum))); //check if all the companies are matched or not. [0,1,2] includes
      });
  
      test("all candidates are matched correctly",function() {
        let candidatesMatched = [];
        hires.forEach(h => candidatesMatched.push(h.candidate));
        assert(candidatesMatched.length === n); //not more than total number of candidates are matched. Also checks if a candidate is matched with more than one company
        assert(candidatesMatched.every(c => candidatesMatched.indexOf(c) === candidatesMatched.lastIndexOf(c)));//no duplicates. A candidate should not be matched with more than 1 company
        assert([0,1,2].every(cNum => candidatesMatched.includes(cNum))); //check if all the candidates are matched or not. [0,1,2] includes
      });
  
      test("Hires is stable with no unstable matches",function() {
        for (let i = 0; i < hires.length; ++i) {
          let curPair = hires[i]; //current pair in hires array, an object
          let curCompany = curPair.company; //company number(0, 1, or 2), an index of companies array
          let curCandidate = curPair.candidate;//candidate number(0, 1, or 2), an index of candidates array
          let prefListOfCurCompany = companies[curCompany];//preference list of current company
          let prefListOfCurCandidate = candidates[curCandidate];//preference list of current candidate
  
          let isStable = true;
  
          //traversing rest of the hires array to find any other pairs that cause unstability w.r.t to the current pair
          for (let p = 0; p < hires.length; ++p) {
            if (p !== i) { //checking other pairs and not the current pair again
              let diffPair = hires[p]; //different pair
              let diffCandidate = diffPair.candidate; //different candidate
              let diffCompany = diffPair.company; //different company
              let prefListOfDiffCandidate = candidates[diffCandidate]; //preference list of different candidate
              let prefListOfDiffCompany = companies[diffCompany]; //preference list of different company
  
              //A pair is unstable if even a single pair is found such that the current company prefers a different candidate over the current candidate
              //and the different candidate also prefers the current company over the different company (different candidate's current match) 
              if ( (prefListOfCurCompany.indexOf(diffCandidate) < prefListOfCurCompany.indexOf(curCandidate)) &&
                   (prefListOfDiffCandidate.indexOf(curCompany) < prefListOfDiffCandidate.indexOf(diffCompany)) ) {
                      isStable = false; break;
              }
  
              //The code does not work if this if statement is also there after the previous if statement
              /*if( (prefListOfCurCandidate.indexOf(diffCompany) < prefListOfCurCandidate.indexOf(curComapny)) &&
                      (prefListOfDiffCompany.indexOf(curCandidate) < prefListOfDiffCompany.indexOf(diffCandidate)) ) {
                        isStable = false; break;
                }*/
  
            }              
          }
          assert(isStable);
        }
      });   
      
    }
  }