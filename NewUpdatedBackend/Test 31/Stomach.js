class Stomach{
    constructor(myBody)
    {
        this.body = myBody;

        this.RAG = 0;
        this.SAG = 0;
        this.protein = 0;
        this.fat = 0;

        this.stomachEmpty = true;

        this.geConstant_ = 500.0; // mg
        this.geSlopeMin_ = 0.03; 
    }

    processTick()
    {
    	//send some chyme to the intestine.

    	//We assume that the nutrient composition of the chyme is same as that of the food in the stomach.

    	//The amount of chyme leaking out of stomach during a minute is equal to a certain minimum
    	//plus a part proportional to the total amount of chyme present in the stomach at that time.
    	//The proportionality constant depends on the energy density of the chyme. If the chyme is all
    	//fat, its energy density would be 9kcal/g. If it is all carbs, the energy density is 4kcal/g.
    	//The proportionality constant should decrease with increase in the energy density of the chyme.

    	//When we consider the fraction of leaked chyme that is dependent on the total amount of food in the
    	// stomach, the energy content should be same when the stomach has 9grams of carbs or 4 grams of fat.
    	//Energy leaked when the stomach has x grams of fat: k9*x*1000*9 cal
    	//Energy leaked when the stomach has x grams of carbs: k4*x*1000*4 cal

    	//Hence

    	//k9*x*1000*9 = k4*x*1000*4 
    	//=>k9*9 = k4*4
    	//=> k4 = 9*k9/4
    	//Similarly
    	//k5 = 9*k9/5

    	//So, we just need to know the proportinality constant k9 (geSlopeMin_) for pure fat.


    	//Chyme leakage does not change the relative fraction of carbs/fats/proteins in the chyme left in the stomach. 

    	if(this.stomachEmpty)
    		return;

        //static std::poisson_distribution<int> geConstant__ (1000.0*geConstant_);
        var geConstant__ = poissonProcess.sample(1000.0*this.geConstant_);
        
        var geConstant = geConstant__ / 1000;
    	var totalFood = this.RAG + this.SAG + this.protein + this.fat;
    	// calorific density of the food in stomach
    	var calorificDensity = (1.0) * (4.0*(this.RAG+this.SAG+this.protein) + 9.0*this.fat)/totalFood; 
    	var geSlope = (1.0) * (9.0 * this.geSlopeMin_/calorificDensity);

        var geBolus = geConstant + geSlope * totalFood;

        //this.body.time_stamp();
    	//console.log("Gastric Emptying:: Total Food " + totalFood + " Calorific Density " + calorificDensity
    	//+ " geSlopeMin " + geSlopeMin + " geSlope " + geSlope + " geConstant " + geConstant + " Bolus " + geBolus + endl);

    	if(geBolus > totalFood)
    		geBolus = totalFood;

    	var ragInBolus = (1.0) * (geBolus*this.RAG/totalFood);
    	var sagInBolus = (1.0) * (geBolus*this.SAG/totalFood);
    	var proteinInBolus = (1.0) * (geBolus*this.protein/totalFood);
    	var fatInBolus = (1.0) * (geBolus*this.fat/totalFood);

    	this.RAG -= ragInBolus;
    	this.SAG -= sagInBolus;
    	this.protein -= proteinInBolus;
    	this.fat -= fatInBolus;

    	this.body.intestine.addChyme(ragInBolus,sagInBolus,proteinInBolus,fatInBolus);

        this.body.time_stamp();
        console.log("Gastric Emptying:: Total Food" + totalFood + "Calorific Density "+ calorificDensity + " geSlope" + geSlope + 
            "ragInBolus " + ragInBolus + "sagInBolus " + sagInBolus);

        if((this.RAG == 0) && (this.SAG == 0) && (this.protein == 0) && (this.fat == 0))
        {
            this.stomachEmpty = true;
            this.body.stomachEmpty();
        }
        
        //this.body.time_stamp();
        //console.log("Stomach : SAG " + this.SAG + " RAG " + this.RAG +  " protein " + this.protein + " fat " + this.fat + endl); 
    }

    addFood(foodID, howmuch)
    {
        // howmuch is in grams
        if(howmuch == 0)
            return;
        
        //name is type string
        var name = this.body.foodTypes[foodID].name;
        
        var numServings = (1.0) * (howmuch/(this.body.foodTypes[foodID].servingSize));
       
        this.RAG += 1000.0*numServings*(this.body.foodTypes[foodID].RAG); // in milligrams
        this.SAG += 1000.0*numServings*(this.body.foodTypes[foodID].SAG); // in milligrams
        this.protein += 1000.0*numServings*(this.body.foodTypes[foodID].protein); // in milligrams
        this.fat += 1000.0*numServings*(this.body.foodTypes[foodID].fat); // in milligrams
        
        if((this.RAG > 0) || (this.SAG > 0) || (this.protein > 0) || (this.fat > 0))
            this.stomachEmpty = false;
        
        //this.body.time_stamp();
        //console.log("Adding " + howmuch + " grams of " + name + " to stomach");   
    }

    /*
    setParams()
    {
        for( ParamSet::iterator itr = body.metabolicParameters[body.bodyState][STOMACH].begin();
            itr != body.metabolicParameters[body.bodyState][STOMACH].end(); itr++)
        {
            if(itr.first.compare("geConstant_") == 0)
            {
                    geConstant_ = itr.second;
            }
            if(itr.first.compare("geSlopeMin_") == 0)
            {
                    geSlopeMin_ = itr.second;
            }
        }
    }
    */
}

