 class PortalVein {
        constructor(body_) {
        	this.body = body_;
            this.glucose = 0; //mg
            this.branchedAA = 0;	//mg
            this.unbranchedAA = 0; //mg
            this.fluidVolume_ = 5; // dl
        }
        
        processTick() {
        	var bgl = this.body.blood.getBGL();
            var glucoseFromBlood = bgl*this.fluidVolume_;
            this.body.blood.removeGlucose(glucoseFromBlood);
            this.glucose += glucoseFromBlood;
            
            //this.body.time_stamp();
            //console.log("PortalVein:: " + this.glucose + " glucose/fluidVolume_ " + this.branchedAA + " " + this.unbranchedAA);
        }
        
        setParams() {
            for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.PORTAL_VEIN.value).entrySet()) {            
                switch (key) {
                    case "fluidVolume_" : { this.fluidVolume_ = value; break; }
                }
            }
        }
        
        getConcentration() {
        	var gl = this.glucose/this.fluidVolume_;
            //this.body.time_stamp();
            //console.log("GL in Portal Vein: " + gl);
         
            return gl;
        }
        
        addGlucose(g) {this.glucose += g;}/////////////// Need to check this perfectly
        
        getGlucose(){return this.glucose;}
        
        removeGlucose(g) {
        	this.glucose -= g;
            if( this.glucose < 0 ) {
                console.log("PortalVein glucose went negative");
                System.exit(-1);
            }
        }
        
        releaseAllGlucose() {
        	this.body.blood.addGlucose(this.glucose);
            this.glucose = 0;
        }
        
        addAminoAcids(aa) {
        	this.branchedAA += 0.15*aa;
            this.unbranchedAA += 0.85*aa;
            //this.body.time_stamp();
            //console.log(" PortalVein: bAA " + this.branchedAA + ", uAA " + this.unbranchedAA);
        }
        
        releaseAminoAcids() {
        	// 93% unbranched amino acids consumed by liver to make alanine
            this.body.blood.alanine += 0.93*this.unbranchedAA;
            this.body.blood.unbranchedAminoAcids += 0.07*this.unbranchedAA;
            this.unbranchedAA = 0;
            this.body.blood.branchedAminoAcids += this.branchedAA;
            this.branchedAA = 0;

            // who consumes these amino acids from blood other than liver?
            // brain consumes branched amino acids
        }
    }


