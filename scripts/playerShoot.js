
var fire :Transform;
var shootDistance = 10;
function Update()
{
if(Input.GetKey (KeyCode.Z)){

var fire_shoot = Instantiate(fire,transform.Find("spawn point").transform.position,Quaternion.identity);
fire_shoot.rigidbody.AddForce(transform.forward*1000);

Destroy(fire_shoot.gameObject,.7);
// we should lay for one second to make one ball extract from the person
}
}


