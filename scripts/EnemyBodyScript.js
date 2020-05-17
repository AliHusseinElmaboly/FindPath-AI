    var moveDamp : float = 0.1;
    var parentToFollow : Transform;
    var parentLastPos : Vector3;
    var targetRotation : Quaternion;
    var turnSpeed : float = 10;
     
    var velocityX : float;
    var velocityZ : float;
     
    var parentScript : enemyMovement;
    var walkAnimationString : String;
    var runAnimationString : String;
     
    var enemyHealth : float = 1;
    var rigidbodies : Rigidbody[];
     
    function Awake ()
    {
        parentScript = transform.parent.GetComponent(enemyMovement);
        animation.wrapMode = WrapMode.Loop;
        parentToFollow = transform.parent;
        transform.parent = null;
    }
     
    function Update ()
    {
        transform.position.x = Mathf.SmoothDamp(transform.position.x, parentToFollow.position.x, velocityX, moveDamp);
        transform.position.z = Mathf.SmoothDamp(transform.position.z, parentToFollow.position.z, velocityZ, moveDamp);
       
        var tempParentCurrentPos : Vector3 = parentToFollow.position;
        var tempParentLastPos : Vector3 = parentLastPos;
        tempParentCurrentPos.y = 0;
        tempParentLastPos.y = 0;
       
        targetRotation = Quaternion.LookRotation(tempParentCurrentPos - tempParentLastPos);
        parentLastPos = parentToFollow.position;
       
        transform.rotation = Quaternion.Lerp(transform.rotation, targetRotation, turnSpeed * Time.deltaTime);
       
        var hits : RaycastHit[];
        hits = Physics.RaycastAll(Ray(transform.position + Vector3(0,100,0), Vector3.up * -1));
        for (var i : int = 0; i < hits.length; i++)
        {
            var hit : RaycastHit = hits[i];
            if (hit.transform.gameObject == parentToFollow.gameObject.GetComponent(enemyMovement).currentCell)
                transform.position.y = hit.point.y;
        }
       
        if (!animation.IsPlaying(walkAnimationString) && !parentScript.aware)
            animation.Play(walkAnimationString);
        if (!animation.IsPlaying(runAnimationString) && parentScript.aware)
            animation.Play(runAnimationString);
           
        if (enemyHealth <= 0)
        {
            for (var rigidbodyFor in rigidbodies)
                rigidbodyFor.isKinematic = false;
            animation.enabled = false;
            parentScript.enabled = false;
            enabled = false;
        }
    }