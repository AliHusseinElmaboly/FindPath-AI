
function OnTriggerEnter(other:Collider)
{

if(other.gameObject.tag=="Enemy"){
	Destroy(other.gameObject);
	
}
}

