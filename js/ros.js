
var ros = null;
var nav = null;
// Publishing a Topic
// -----------------
var pubTopic=null;

window.onload=function(){
    $("#pubTopicName").val("/turtle1/cmd_vel");
    $("#pubTopicType").val("geometry_msgs/Twist");
    $("#host").val("192.168.0.118");
    $("#port").val(9090);
    $("#sendPubData").val('{"linear":{"x":0.5,"y":0,"z":0},"angular":{"x":0,"y":0,"z":0}}');
    //toggleBindTopic();
    //window.setInterval(function(){cmdVel.publish(twist);},2000)

};

var onunload2 =function (){
    console.log("on unload  close");
    if(ros!=null){
        ros.close();
    }
};
//  window.onunload = onunload2;
window.onbeforeunload = onunload2;
var gridClient=null;
function viewMap(){
    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
        divID : 'rosmap',
        width : 800,
        height : 500
    });

    // Setup the map client.
    /**
     gridClient = new ROS2D.OccupancyGridClient({
		  ros : ros,
		  rootObject : viewer.scene
		});
     // Scale the canvas to fit to the map

     gridClient.on('change', function(){
			console.log("===map");
		  viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
		});
     */
    // Setup the nav client.
    nav = NAV2D.OccupancyGridClientNav({
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer
    });
}

function addGoals(goal){
    var goalID=goal.goalID;
    var coor ="("+(Math.round(goal.goalMessage.goal.target_pose.pose.position.x*100)/100.0+" , "+Math.round(goal.goalMessage.goal.target_pose.pose.position.y*100)/100.0)+")";
    var trInner=$("#goalsTr_template").html();
    trInner=trInner.replace(/#goalID#/g,goalID);
    trInner=trInner.replace("#coor#",coor);
    var tr ="<tr>"+trInner+"</tr>";
    $("#goals").append(tr);

}
function cancleGoal(goalID){
    var cancleTopic = new ROSLIB.Topic({
        ros : ros,
        name : '/move_base/cancel',
        messageType :'actionlib_msgs/GoalID'
    });
    var cancle =new ROSLIB.Message({"stamp":{},"id":goalID});
    cancleTopic.publish(cancle);
    alert("取消导航成功："+goalID);
}
function connectToServer(){
    var host=$("#host").val();
    var port=$("#port").val();
    if(host==null || host==""){
        alert("请输入host");
        return;
    }
    if(port==null || port==""){
        alert("请输入port");
        return;
    }
    ros = new ROSLIB.Ros({
        url : 'ws://'+host+':'+port
    });
    ros.on('connection', function() {
        alert("connect to websocket server successful!");
        console.log('Connected to websocket server.');
        viewMap();
    });

    ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
        console.log('Connection to websocket server closed.');
    });
}

var toggle_bind=false;
function toggleBindPubTopic(){
    if(!toggle_bind){
        bindPubTopic();
        toggle_bind=true;
    }else{
        unBindPubTopic();
        toggle_bind=false;
    }
}

function bindPubTopic(){
    if(ros==null){
        alert("请先连接到rosbridge服务器");
        return;
    }
    var topicName=$("#pubTopicName").val();
    var topicType=$("#pubTopicType").val();
    if(topicName==null || topicName==""){
        alert("请先输入TopicName");
        return;
    }
    if(topicType==null || topicType==""){
        alert("请先输入topicType");
        return;
    }
    $("#bindPubTopicBtn").text("unBindPubTopic");
    $("#pubTopicTr .in").attr("disabled",true);
    pubTopic = new ROSLIB.Topic({
        ros : ros,
        name : topicName,
        messageType :topicType
    });
    $("#sendPubDataTr").show();
}
function unBindPubTopic(){

    $("#bindPubTopicBtn").text("bindPubTopic");
    $("#pubTopicTr .in").attr("disabled",false);
    $("#pubTopicTr .in").val("");
    pubTopic=null;
    $("#sendPubDataTr").hide();
}
function sendPub(){
    var sendData=$("#sendPubData").val();
    if(pubTopic==null){
        alert("请先绑定Topic");
        return;
    }

    var curTwist = new ROSLIB.Message(JSON.parse(sendData));
    pubTopic.publish(curTwist);
}
// Subscribing to a Topic

var subTopic = null;
function bindSubTopic(){
    if(ros==null){
        alert("请先连接到rosbridge服务器");
        return;
    }
    var topicName=$("#subTopicName").val();
    var topicType=$("#subTopicType").val();
    if(topicName==null || topicName==""){
        alert("请先输入TopicName");
        return;
    }
    if(topicType==null || topicType==""){
        alert("请先输入topicType");
        return;
    }
    subTopic = new ROSLIB.Topic({
        ros : ros,
        name : topicName,
        messageType :topicType
    });
    subTopic.subscribe(function(message) {
        console.log('Received message on ' + subTopic.name + ': ' + message);
        console.log(message);
        //subTopic.unsubscribe();
    });
}
// ----------------------

/*  var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/listener',
    messageType : 'std_msgs/String'
  });

  listener.subscribe(function(message) {
    console.log('Received message on ' + listener.name + ': ' + message.data);
    listener.unsubscribe();
  });
*/
// Calling a service
// -----------------

/* var addTwoIntsClient = new ROSLIB.Service({
   ros : ros,
   name : '/add_two_ints',
   serviceType : 'rospy_tutorials/AddTwoInts'
 });

 var request = new ROSLIB.ServiceRequest({
   a : 1,
   b : 2
 });

 addTwoIntsClient.callService(request, function(result) {
   console.log('Result for service call on '
     + addTwoIntsClient.name
     + ': '
     + result.sum);
 });

 // Getting and setting a param value
 // ---------------------------------

 ros.getParams(function(params) {
   console.log(params);
 });

 var maxVelX = new ROSLIB.Param({
   ros : ros,
   name : 'max_vel_y'
 });

 maxVelX.set(0.8);
 maxVelX.get(function(value) {
   console.log('MAX VAL: ' + value);
 });*/