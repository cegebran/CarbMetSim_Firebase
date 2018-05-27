class AdiposeTissue{
	constructor(myBody){
		this.body = myBody;
    	this.glucoseAbsorbed_ = 0;
        this.bAAToGlutamine_ = 0;
        this.lipolysisRate_ = 0;
        this.fat = (this.body.fatFraction)*(this.body.bodyWeight_)*1000.0;
	}

	processTick(){
        /*
        console.log(this.body.blood.getBGL());
		if( this.body.blood.getBGL() < this.body.blood.normalGlucoseLevel_ ) {
            var lipolysis = this.body.insulinResistance_*this.lipolysisRate_;
            this.body.blood.gngSubstrates += this.lipolysis;
        } else {
            this.body.blood.gngSubstrates += this.lipolysisRate_;
        }
	
		if( this.body.blood.branchedAminoAcids > this.bAAToGlutamine_ ) {
            this.body.blood.branchedAminoAcids -= this.bAAToGlutamine_;
            this.body.blood.glutamine += this.bAAToGlutamine_;
        } else {
            this.body.blood.glutamine += this.body.blood.branchedAminoAcids;
            this.body.blood.branchedAminoAcids = 0;
        }
        */
        
        //this.body.time_stamp();
        //console.log(" BodyWeight: " + this.body.bodyWeight_);
	}

	setParams(){
		for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.ADIPOSE_TISSUE.value).entries()) {
    		switch (key) {
    			case "glucoseOxidized_" : { this.glucoseAbsorbed = value; break; }
    			case "glucoseToAlanine_" : { this.lipolysisRate_ = value; break; }
    			case "bAAToGlutamine_" : { this.bAAToGlutamine_ = value; break; }
    		}
    	}
	}

	 lipogenesis(glucoseInMG) {
    	// one gram of glucose has 4kcal of energy
        // one gram of TAG has 9 kcal of energy
        //System.out.println("BodyWeight: Lipogenesis " + body.bodyWeight_ + " glucose " + glucoseInMG + " fat " + fat);
        this.body.bodyWeight_ -=  this.fat/1000.0;
        this.fat += (glucoseInMG/1000) * 4.0 / 9.0;
        this.body.bodyWeight_ += this.fat / 1000.0;
        //console.log("BodyWeight: Lipogenesis " + this.body.bodyWeight_ + " glucose " + glucoseInMG + " fat " + this.fat);
    }

     consumeFat(kcal) {

    	this.body.bodyWeight_ -= this.fat/1000.0;
        this.fat -= kcal/9.0;
        this.body.bodyWeight_ += this.fat/1000.0;
    }

      addFat(newFatInMG) {
    	 this.body.bodyWeight_ -= this.fat/1000.0;
    	 this.fat += newFatInMG/1000.0;
    	 this.body.bodyWeight_ += this.fat/1000.0;
    	 //console.log("BodyWeight: addFat " + this.body.bodyWeight_ + " newfat " + newFatInMG);
    } 
}

