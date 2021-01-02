import {appConfig, envConfig} from "@/main";

export default {
  text: function(_message){
    if(envConfig.NODE_ENV !== 'production' || appConfig.DEBUG_MODE){
      console.log(_message);
    }
  },
  obj: function(_title,_object){
    if(envConfig.NODE_ENV !== 'production' || appConfig.DEBUG_MODE){
      console.log(_title,_object);
    }
  }
}
