var currentCell:GameObject;

function OnTriggerEnter(other:Collider)
{

if(other.gameObject.tag=="AIpathCell"){
currentCell=other.gameObject;
}
}


function OnTriggerExit(other:Collider)
{

if(other.gameObject.tag=="AIpathCell"){
currentCell=null;
}
}