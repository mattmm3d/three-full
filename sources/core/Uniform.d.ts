//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WARNING: This file was auto-generated, any change will be overridden in next release. Please use configs/es6.conf.js then run "npm run convert". //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class Uniform {
  constructor(value: any);
  
  constructor(type: string, value: any);
  
  type: string;
  value: any;
  
  dynamic: boolean;
  onUpdateCallback: Function;
  onUpdate(callback: Function): Uniform;
}
