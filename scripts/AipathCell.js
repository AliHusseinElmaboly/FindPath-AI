
    var doors = new Array();
     
    function OnTriggerEnter (other : Collider)
    {
        if (other.tag == "AIpathDoor")
            doors.Push(other.gameObject);
    }