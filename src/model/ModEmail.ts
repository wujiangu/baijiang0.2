/** email manage 
 * @author hong
 * @date 2017/9/4
*/

module ModEmail{

    let EmailData:any = null;

    export function SetEmailData(val:any):void{
        EmailData = [];
        if(val){
            for(let data of val){
                if(Common.CountSurlTime(data.date, 30) == 0){
                    HttpRequest.getInstance().send("DELETE", "email", {emailId:data.id}, ()=>{}, this);
                }
                else EmailData.push(data);
            }
        }
    }

    export function GetEmailData():any{
        return EmailData;
    }

    export function ReqGetEmail(listener:Function = null):any{
        HttpRequest.getInstance().send("GET", "email", "", (data)=>{
            SetEmailData(data.email);
            if(listener) listener();
        },this)
    }

    export function DelEmailData(data:any):void{
        HttpRequest.getInstance().send("DELETE", "email", {emailId:data.id}, ()=>{}, this);
        for(let i:number = 0; i < EmailData.length; i++){
            if(data.id == EmailData[i].id){
                for(let j:number = i; j < EmailData.length - 1; j++){
                    EmailData[j] = EmailData[j + 1];
                }
                break;
            }
        }
        EmailData.pop();
    }

    export function DealAllEmailData():void{
        for(let data of EmailData){
            HttpRequest.getInstance().send("DELETE", "email", {emailId:data.id}, ()=>{}, this);
        }
        EmailData = [];
    }
}