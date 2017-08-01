// const AV = window["AV"];
class LeanCloud{
    public constructor(){
    }

    public static instance:LeanCloud;
    public static GetInstance():LeanCloud{
        if(this.instance == null){
            this.instance = new LeanCloud();
        }
        return this.instance;
    }

    /** 注册账号 */
    public Register(username:string, password:string):void{
        let user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        user.signUp().then(function (User){
            Common.log(JSON.stringify(User))
            LeanCloud.createRoleData(user);
        }, function (error){
            if(error.code == 202){
                console.log(" this user readly Register")
            }
            else
            {
                Common.log(error.code)
            }
        });
    }

     /** 登入 */
    public Login(username:string, password:string, callBack:Function=null):void{
         AV.User.logIn(username, password).then(function (loginedUser) {
            // 登录成功，跳转到商品 list 页面
            // Common.log(JSON.stringify(loginedUser))
            LeanCloud.ObjectId = loginedUser.id;
            if (callBack) {
                callBack();
            }
        }, function (error) {
            if(error == 210){
                console.log(" password input error ");
            }
            else
                Common.log(JSON.stringify(error));
        });
    }

    /** 创建角色数据 */
    public static createRoleData(user:any):void{
        let RoleData = AV.Object.extend("RoleData");
        let rd = new RoleData();
        rd.set("lv", 1);
        rd.set("gold", 1000);
        rd.set("soul", 1000);
        rd.save().then(function(todo){
            user.set("roleId", todo.id);
            user.set("goodsId", "");
            user.set("roleName","jane");
            user.save();
        },function(error){
            console.log(error);
            console.log(" create roledata error")
        })
    }

    /** 保存装备数据 */
    public SaveEquipData():void{

        if(LeanCloud.GoodsId.length == 0){
            let EquipData = AV.Object.extend("EquipData");
            let td = new EquipData();
            td.set("equip", JSON.stringify(modEquip.EquipData.GetInstance().GetEquipList()));
            td.save().then(function(todo){
                let data = todo.get("equip");
                Common.log(JSON.stringify(data));
                let query = new AV.Query("_User");
                LeanCloud.GoodsId = todo.id;
                query.get(LeanCloud.ObjectId).then(function(info){
                    info.set("goodsId", LeanCloud.GoodsId);
                    info.save();
                });
                
            },function(error){
                console.log("create equip error");
            })
        }
        else
        {
            let query = new AV.Query("EquipData");
            query.get(LeanCloud.GoodsId).then(function(todo){
                todo.set("equip", JSON.stringify(modEquip.EquipData.GetInstance().GetEquipList()));
                todo.set("lucky", modEquip.EquipData.GetInstance().Lucky);
                todo.save();
            },function(error){
                console.log(" save euqip error ")
            });
        }
    }

    /** 保存角色数据 */
    public SaveRoleData(tag:string, value:any):void{
        let query = new AV.Query("RoleData");
        query.get(LeanCloud.RoleId).then(function(todo){
            todo.set(tag, value);
            todo.save();
        });
    }

    /** 初始化装备数据 并将其保存到全局变量数组中 */
    public static InitEquipData():void{
        let query = new AV.Query("EquipData");
        query.get(LeanCloud.GoodsId).then(function(todo){
            // Common.log(todo.get("equip"));
            let data = JSON.parse(todo.get("equip"));
            for(let i:number = 0; i < data.length; i++){
                let info = new modEquip.EquipInfo(data[i].id, data[i].star, data[i].quality, data[i].lv);
                info.SetEquipAttr(data[i].attr_list);
                for(let j in data[i].attrType){
                    info.InsertAttrType(new modEquip.AttrType(data[i].attrType[j].type, data[i].attrType[j].value));
                }
                modEquip.EquipData.GetInstance().Add(info);
                modEquip.EquipData.GetInstance().Lucky = todo.get("lucky") == null ? 0 : todo.get("lucky");
            }
        },function(error){
            console.log(" init euqip error ")
        });

        let roleQuery = new AV.Query("RoleData");
        roleQuery.get(LeanCloud.RoleId).then(function(todo){
            let data = todo._serverData;
            UserDataInfo.GetInstance().SaveData(data);
            // Common.log("玩家数据",data);
            let heroData = UserDataInfo.GetInstance().getUserInfo();
            HeroData.initData(heroData.hero);
            modTalent.initData(heroData.talentPage)
        },function(error){
            console.log(" init role error ")
        });

        let initQuery = new AV.Query("InitData");
        Common.log(LeanCloud.InitDataId)
        initQuery.get(LeanCloud.InitDataId).then(function(todo){
            let data = todo._serverData;
            GameData.saveData(data);
        },function(error){
            console.log(" init role error ")
        });
    }

    /** 获得初始数据 */
    public InitData():any{
       
        let query = new AV.Query("_User");

        query.get(LeanCloud.ObjectId).then(function(todo){
            LeanCloud.GoodsId = todo.get("goodsId");
            LeanCloud.RoleId = todo.get("roleId");
            LeanCloud.InitDataId = todo.get("initDataId");
            LeanCloud.NoviceId = todo.get("noviceId");
            UserData.RoleName  = todo.get("roleName");
            UserData.rankDamage = todo.get("damage");
            RankData.GetInstance().InitDataList(JSON.parse(todo.get("rankData")));
            LeanCloud.GetInstance().InitRoleData();
            if(LeanCloud.GoodsId.length != 0){
                LeanCloud.InitEquipData()
            }
        },
        function(error){
            console.log(" error")
        })
    }

    public SaveRankData():any{
     
        let query = new AV.Query("_User");
        query.get(LeanCloud.ObjectId).then(function(todo){
            todo.set("rankData", JSON.stringify(RankData.GetInstance().GetDataList()));
            todo.set("damage", UserData.rankDamage);
            todo.set("name", UserData.RoleName);
            todo.save();
        },
        function(error){
            Common.log(error);
        })
        
    }

    public InitRoleData():void{
        let query = new AV.Query("RoleData");
        query.get(LeanCloud.RoleId).then(function(todo){
            let str_list:any = ["exp", "soul", "diamond", "power", "recharge", "curTalentPage", "email", "revivalCount"];
            for(let i in str_list){
                UserDataInfo.GetInstance().SetBasicData(str_list[i], todo.get(str_list[i]), false);
            }
        },
        function(error){
            Common.log(error);
        })
    }

    public SaveRoleBasicData():void{
        let query = new AV.Query("RoleData");
        query.get(LeanCloud.RoleId).then(function(todo){
            let str_list:any = ["exp", "soul", "diamond", "power", "recharge", "email", "revivalCount"];
            for(let i in str_list){
                todo.set(str_list[i], UserDataInfo.GetInstance().GetBasicData(str_list[i]))
            }
            todo.save();
        });
    }

    public static set ObjectId(val:string){
        this.objectId = val;
    }

    public static get ObjectId(){
        return this.objectId;
    }

    public static set GoodsId(val:string){
        this.goodsId = val;
    }

    public static get GoodsId(){
        return this.goodsId;
    }

    public static set RoleId(val:string){
        this.roleId = val;
    }

    public static get RoleId(){
        return this.roleId;
    }

    public static get InitDataId(){
        return this.initDataId;
    }    

    public static set InitDataId(val:string){
        this.initDataId = val;
    }

    public static get NoviceId(){
        return this.noviceId;
    }  

    public static set NoviceId(val:string){
        this.noviceId = val;
    }

    private static objectId:string;
    private static goodsId:string;
    private static roleId:string;
    private static initDataId:string;
    private static noviceId:string;
}