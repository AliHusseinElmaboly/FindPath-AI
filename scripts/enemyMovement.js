    var currentCell : GameObject;
    var playerMovementScript : playerMovement;
    var playerTransform : Transform;
    var playerCell : GameObject;
    var goalDoor : GameObject;
    var shortestPathSoFar : float;
    @HideInInspector
    var waitToStart : int = 5;
    var maxMoveSpeed : float = 5;
    var minMoveSpeed : float = 1;
    var speedDamage : float = 0.5;
    var speedRecover : float = 1;
    var currentMoveSpeed : float = 5;
     
    var randomizedCourse : boolean = false;
    var randomizeCourseVector : Vector3;
    var calculatedNewRandomizeCourseVector : boolean;
     
    var lastPos : Vector3;
     
    var viewAngle : float = 60;
    var aware : boolean = false;
    var unawareSpeed : float = 1;
    var stop :boolean =false;
     
     
     
    function Awake ()
    {
        shortestPathSoFar = Mathf.Infinity;
        playerMovementScript = GameObject.FindWithTag("Player").GetComponent(playerMovement);
        playerTransform = GameObject.FindWithTag("Player").transform;
        waitToStart = 5;
        randomizeCourseVector = transform.position;
        lastPos = transform.position;
        aware = false;
    }
     
    function Update ()
    {
        if (waitToStart <= 0)
        {
            playerCell = playerMovementScript.currentCell;
            for (var doorCheckingNow : GameObject in currentCell.GetComponent(AipathCell).doors)
            {
                for (var i : int = 0; i <= doorCheckingNow.GetComponent(AipathDoor).cells.length - 1; i++)
                {
                    if (doorCheckingNow.GetComponent(AipathDoor).cells[i] == playerCell)
                    if (doorCheckingNow.GetComponent(AipathDoor).doorsToCells[i] < shortestPathSoFar)
                    {
                        goalDoor = doorCheckingNow;
                        shortestPathSoFar = doorCheckingNow.GetComponent(AipathDoor).doorsToCells[i];
                    }
                }
            }
            shortestPathSoFar = Mathf.Infinity;
        }
        waitToStart -= 1;
       
        var hits : RaycastHit[];
        var anyHit : boolean = false;
        if (Vector3.Angle(transform.forward, playerTransform.position - transform.position) < viewAngle / 2 && !aware)
        {
            hits = Physics.SphereCastAll(transform.position, transform.localScale.x / 3, playerTransform.position - transform.position, Vector3.Distance(transform.position, playerTransform.position));
            for (var hit : RaycastHit in hits)
            {
                if (hit.transform.tag == "Level Parts")
                    anyHit = true;
            }
            if (!anyHit)
                aware = true;
        }
       
        if (!aware)
            goalDoor = null;
       
        if (!calculatedNewRandomizeCourseVector)
        {
            randomizeCourseVector = FindRandomSpotInCurrentCell();
            calculatedNewRandomizeCourseVector = true;
        }
       
        if (goalDoor)
        if (!goalDoor.GetComponent(AipathDoor).doorOpen)
            goalDoor = null;
     
    
        if (currentCell != playerCell || playerCell == null || !aware)
        {
            if (randomizedCourse && goalDoor)
                transform.position += (goalDoor.transform.position - transform.position).normalized * currentMoveSpeed * Time.deltaTime;
            if (!randomizedCourse)
            {
                transform.position += (randomizeCourseVector - transform.position).normalized * currentMoveSpeed * Time.deltaTime;
                if (Vector3.Distance(transform.position, randomizeCourseVector) < transform.localScale.x)
                {
                    if (goalDoor)
                        randomizedCourse = true;
                    if (goalDoor == null)
                        calculatedNewRandomizeCourseVector = false;
                }
            }
        }
      
       else if(aware && stop){//do nothing now
       }
       
       else if (playerCell == currentCell && aware)
            transform.position += (playerTransform.position - transform.position).normalized * currentMoveSpeed * Time.deltaTime;
        
    
        	
        
        if (currentMoveSpeed < maxMoveSpeed && aware)
            currentMoveSpeed += speedRecover * Time.deltaTime;
        if (currentMoveSpeed > maxMoveSpeed && aware)
            currentMoveSpeed = maxMoveSpeed;
     
        if (currentMoveSpeed < unawareSpeed && !aware)
            currentMoveSpeed += speedRecover * Time.deltaTime;
        if (currentMoveSpeed > unawareSpeed && !aware)
            currentMoveSpeed = unawareSpeed;
          
        transform.rotation = Quaternion.LookRotation(transform.position - lastPos);
        lastPos = transform.position;
        
        
    }
     
    function OnTriggerEnter (hitTrigger : Collider)
    {
        if (hitTrigger.tag == "AIpathCell")
        {
            currentCell = hitTrigger.gameObject;
            randomizedCourse = false;
            calculatedNewRandomizeCourseVector = false;
        }
       
    }
     
    function OnTriggerStay (hitTrigger : Collider)
    {
        if (hitTrigger.tag == "Enemy" && hitTrigger.gameObject != gameObject)
        {
            if (currentMoveSpeed > minMoveSpeed)
                currentMoveSpeed -= speedDamage;
            transform.position += (transform.position - hitTrigger.transform.position).normalized * 0.1;
        }
       if(hitTrigger.tag == "Range" )
       	stop = true;
       else 
        stop = false;
       
    }
     
    function FindRandomSpotInCurrentCell ()
    {
        return currentCell.transform.position + (currentCell.transform.rotation * Vector3(Random.Range(currentCell.transform.localScale.x * -0.5,currentCell.transform.localScale.x * 0.5),0,Random.Range(currentCell.transform.localScale.z * -0.5,currentCell.transform.localScale.z * 0.5)));
    }