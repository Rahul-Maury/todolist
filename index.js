const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const _=require("lodash");
const app=express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
//mongodb://127.0.0.1:27017
//mongodb+srv://rahul1646:Rahul123@cluster0.rz4sqkk.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://rahul1646:Rahul123@cluster0.rz4sqkk.mongodb.net/item').then(function(){
console.log("sucessfully connected");
});
const itemschema=mongoose.Schema({
  name:String
});
const Item=mongoose.model("Item",itemschema);

const item2=new Item({
  name:"lallu"
});
const item3=new Item({
  name:"welcome to your work list"
});
const item1=new Item({
name:"QB"
});
const defaultItems=[item3];
// const i1=new Item({
//   name:"basanti"
// })
// const value=[i1];
app.use(express.static("public"));
app.get('/',(req,res)=>{
    var time=new Date();
    const options={
     weekday:'long',
     year:'numeric',
     month:'long',
     day:'numeric'
    }
    var day=time.toLocaleDateString("en-HI",options);
    Item.find({},function(err,data){
      if(data.length===0){
        Item.insertMany(defaultItems,function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("item successfully added");
          }


        });
         res.redirect('/');
      }
    else{
        res.render("index",{list_title:"Today",listitem:data});
    }
      
      
    })
 
  // res.render("index",{list_title:day,listitem:values});

});
app.post('/delete',function(req,res){
      const checkboxid=req.body.checkbox;
      const listName=req.body.listName;
      if(listName=="Today"){
        Item.findByIdAndRemove(checkboxid,function(err){
          if(!err){
            
            console.log("item deleted successfully");
            res.redirect('/');
          }
        })

      }
      else{

       List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkboxid}}},function(err,foundList) {
        if(!err){
          res.redirect("/"+  listName);
        }
       })

      }
      
      
});
const listSchema=new mongoose.Schema({
  name:String,
    items:[itemschema]
  
});
const List= mongoose.model("List",listSchema);


     
app.get("/:customlisName",function(req,res){
  const customListName=_.capitalize(req.params.customlisName);

List.findOne({name:customListName},function(err,foundList){
  if(!err){
    if(!foundList){
      // console.log("file does not exits");
      const list= new List({
        name:customListName,
        items:defaultItems
       });
       list.save();
      res.redirect("/"+customListName);
    
    }
    else{
      // console.log("file exits");
      res.render("index",{list_title:foundList.name,listitem:foundList.items});
    }
  }
})


});



app.post('/' ,function(request,response){
 let itemname=request.body.name;
 const listName=request.body.list;
//  console.log(listName);

const item=new Item({
  name:itemname
});
// item.save();
if(listName==="Today")
{
item.save();
response.redirect("/");
}
else{
  List.findOne({name:listName},function(err,foundList){
     foundList.items.push(item);
     foundList.save();
     response.redirect("/"+listName);

  });
}


// response.redirect("/");


})



app.listen(process.env.PORT||3000,function(req,res){
    console.log("you are on port no. 3000");
})
