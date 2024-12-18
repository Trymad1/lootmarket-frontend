class StateUtil {

    constructor() {
        this.userAdState = new UserAd();
        this.dealsState = new Deals();
    }

}

class UserAd {
    
    isUpdateRequired = true;

    setUpdateRequired(value) {
        this.isUpdateRequired = value;   
    }

    getUpdateRequired() {
        return this.isUpdateRequired;
    }

}

class Deals {
    
    isUpdateRequired = true;

    setUpdateRequired(value) {
        this.isUpdateRequired = value;   
    }

    getUpdateRequired() {
        return this.isUpdateRequired;
    }

}

export const stateUtil = new StateUtil();