export enum PrivacyLevel {
  PUBLIC = 0,
  NORMAL = 1,
  PRIVATE = 2,
  TOP_SECRET = 3,
}

export enum ConnectionType {
  OFFLINE = 0,
  WIFI = 1,
  MOBILE = 2,
}

export enum SignalStrenght {
  WEAK = 0,
  NORMAL = 1,
  STRONG = 2,
}

export enum ConnectionSpeed {
  CRITICAL_LOW = 0,
  LOW = 1,
  NORMAL = 2,
  FAST = 3,
  ULTRA_FAST = 4,
}

export type EnviromentProperties = {
  privacyLevel: PrivacyLevel,
  baterryLevel: number, // [0, 1]
  signalStrenght: SignalStrenght,
  connectionType: ConnectionType,
  connectionSpeed: ConnectionSpeed,
  dataSize: number, // KB
}

var DecisionTreeClassifier = function() {

  var findMax = function(nums) {
      var index = 0;
      for (var i = 0; i < nums.length; i++) {
          index = nums[i] > nums[index] ? i : index;
      }
      return index;
  };

  this.predict = function(features) {
      var classes = new Array(2);
          
      if (features[1] <= 0.30000000074505806) {
          classes[0] = 0; 
          classes[1] = 1; 
      } else {
          classes[0] = 1; 
          classes[1] = 0; 
      }
  
      return findMax(classes);
  };

};

const decisionTree = new DecisionTreeClassifier();

export const shouldSendData: (config: EnviromentProperties) => boolean = (config) => {
  return !!decisionTree.predict(
    [
      config.privacyLevel,
      config.baterryLevel,
      config.signalStrenght,
      config.connectionType,
      config.connectionSpeed,
      config.dataSize
    ]
  );
}
