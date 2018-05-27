// User defined class
// to store element and its priority
class QElement {
    constructor(firetime, activityID, subID, howmuch)
    {
        this.firetime = firetime;
        this.ID = activityID;
        this.subID = subID;
        this.howmuch = howmuch;
    }

    costs_less(oqe){
            if(this.firetime < oqe.firetime){
                return true;
            }
            else if(this.firetime > oqe.firetime){
                return false;
            }
            else if(this.firetime === oqe.firetime){
                return "tie";
            }
            else{
                return false;
            }
        }
}

// PriorityQueue class
class PriorityQueue {
 
    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }
 
    // enqueue function to add element
    // to the queue as per priority
    enqueue(element)
    {
        // creating object from queue element
        //var qElement = new QElement();
        var contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            /*if(this.items[i].costs_less(element) === "tie"){
                this.items.splice(i+1,0, element);
            }*/
            if(this.items[i].costs_less(element) === false){
                this.items.splice(i,0, element);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(element);
        }
    }
    
    // dequeue method to remove
    // element from the queue
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    
    // front function
    front()
    {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
        //return this.items[0].ID + ", " + this.items[0].firetime;
    }
    
    // rear function
    rear()
    {
        // returns the lowest priorty
        // element of the queue
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
        //return this.items[this.items.length - 1].ID + ", " + this.items[this.items.length - 1].firetime;
    }
    
    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }
 
    // printQueue function
    // prints all the element of the queue
    printPQueue()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].ID + ", " + this.items[i].firetime + " || ";
        
        return str;
    }
}

