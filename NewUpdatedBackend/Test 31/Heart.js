//package sim;
//import java.util.Map.Entry;

class Heart {
    constructor(mybody) {
    	this.body = mybody;
        this.lactateOxidized_ = 0;
        this.basalGlucoseAbsorbed_ = 14; //mg per minute
        //Skeletal Muscle Glycolysis, Oxidation, and Storage of an Oral Glucose Load- Kelley et.al.
        
        this.Glut4Km_ = 5*180.1559/10.0; //mg/dl equivalent of 5 mmol/l
        this.Glut4VMAX_ = 0; //mg per kg per minute
        this.oxidationPerTick = 0;
    }
    
    processTick()
    {
        var basalGlucoseAbsorbed__ = poissonProcess.sample(1000.0 * this.basalGlucoseAbsorbed_);
        
        var basalAbsorption = basalGlucoseAbsorbed__ / 1000;
        
        this.body.blood.removeGlucose(basalAbsorption);
        
        this.oxidationPerTick = basalAbsorption;
        
        //Absorption via GLUT4
        /*
        var bgl = this.body.blood.getBGL();
        var scale = (1.0 - this.body.insulinResistance_)*(this.body.blood.insulin)*(this.body.bodyWeight_);
        var g = scale*this.Glut4VMAX_*bgl/(bgl + this.Glut4Km_);
        
        this.body.blood.removeGlucose(g);
        
        this.oxidationPerTick += g;
        */
        
        this.body.time_stamp();
        console.log("Heart:: Oxidation " + this.oxidationPerTick);
        
        /*
        var lactateOxidized = lactateOxidized__ / 1000;
        if( this.body.blood.lactate >= this.lactateOxidized_ ) {
            this.body.blood.lactate -= this.lactateOxidized_;
        } else {
            this.body.blood.lactate = 0;
        }
        */
    }
    setParams() {
    for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.ADIPOSE_TISSUE.value).entries()) {
            switch (key) {
    			case "lactateOxidized_" : { this.lactateOxidized_ = value; break; }
    			case "basalGlucoseAbsorbed_" : { this.basalGlucoseAbsorbed_ = value; break; }
    			case "Glut4Km_" : { this.Glut4Km_ = value; break; }
    			case "Glut4VMAX_" : { this.Glut4VMAX_ = value; break; }
    		}
    	}
    }
}
