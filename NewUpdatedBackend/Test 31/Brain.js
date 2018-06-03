class Brain{
    constructor(myBody){
        this.glucoseOxidized_ = 83.333;
        this.glucoseToAlanine_ = 0;
        this.bAAToGlutamine_ = 0;
        this.body = myBody;
        this.oxidationPerTick = 0;
    }

    processTick() {
        var glucoseOxidized__ = poissonProcess.sample(1000.0 * this.glucoseOxidized_);
        
        var g = glucoseOxidized__ / 1000;
        this.oxidationPerTick = g;
        this.body.blood.removeGlucose(g + this.glucoseToAlanine_);
        this.body.blood.alanine += this.glucoseToAlanine_;

        //Brain generate glutamine from branched amino acids.
        if( this.body.blood.branchedAminoAcids > this.bAAToGlutamine_ ) {
            this.body.blood.branchedAminoAcids -= this.bAAToGlutamine_;
            this.body.blood.glutamine += this.bAAToGlutamine_;
        } else {
            this.body.blood.glutamine += this.body.blood.branchedAminoAcids;
            this.body.blood.branchedAminoAcids = 0;
        }
        
        this.body.time_stamp();
        console.log("Brain Oxidation" + this.oxidationPerTick);
    }

    setParams(){
        for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.BRAIN.value).entries()) {
            switch (key) {
                case "glucoseOxidized_" : { this.glucoseOxidized_ = value; break; }
                case "glucoseToAlanine_" : { this.glucoseToAlanine_ = value; break; }
                case "bAAToGlutamine_" : { this.bAAToGlutamine_ = value; break; }
            }
        }
    }
}
