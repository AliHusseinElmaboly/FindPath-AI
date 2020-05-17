    var cells = new Array();
    var doorsToCells = new Array();
    var imediateCells = new Array();
    var testForCells : boolean = true;
    var waitToTestCells : float = 2;
    var stage : int = 1;
     
    @HideInInspector
    var doorOpen : boolean = true;
     
    function Awake ()
    {
        doorOpen = true;
        cells = GameObject.FindGameObjectsWithTag("AIpathCell");
        doorsToCells.length = cells.length;
        testForCells = true;
        waitToTestCells = 2;
        stage = 1;
    }
     
    function Update ()
    {
        if (testForCells && waitToTestCells <= 0)
        {
            for (var imediateCell : GameObject in imediateCells)
            {
                for (var i : int = 0; i <= cells.length - 1; i++)
                {
                    if (cells[i] == imediateCell)
                        doorsToCells[i] = 1;
                }
            }   
           
            for (stage = 2; stage <= cells.length; stage++)
            {
                for (i = 0; i <= cells.length - 1; i++)
                {
                    if (doorsToCells[i] == stage - 1)
                        for (var checkDoor : GameObject in cells[i].GetComponent(AipathCell).doors)
                        {
                            if (checkDoor != gameObject)
                            {
                                for (var checkCell : GameObject in checkDoor.GetComponent(AipathDoor).imediateCells)
                                {
                                    for (var j : int = 0; j <= cells.length - 1; j++)
                                    {
                                        if (cells[j] == checkCell && doorsToCells[j] == null)
                                            doorsToCells[j] = stage;
                                    }
                                }
                            }
                        }
                }
            }
               
           
            testForCells = false;
        }
        waitToTestCells -= 1;
    }
     
    function OnTriggerEnter (other : Collider)
    {
        if (other.tag == "AIpathCell")
            imediateCells.Add(other.gameObject);
    }