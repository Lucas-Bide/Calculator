const keys = Array.from(document.querySelectorAll("button"));
const screen = document.querySelector("#content");
let onScreen = "";
let isAnswered = false;

for (let i = 0; i < keys.length; i++)
{
    let key = keys[i].textContent;
    keys[i].setAttribute("data-key", key.charCodeAt(0));
    if ("0123456789.".includes(key))
        keys[i].addEventListener("click", writeDigit);
    else if ("+-/*".includes(key))
        keys[i].addEventListener("click", writeOperator);
    else if (key === "c")
        keys[i].addEventListener("click", clear);
    else
        keys[i].addEventListener("click", operate);
}

// Got to use data-key here!
window.addEventListener("keydown", (e) => {
    let event = new Event("click");
    let button = keys.find(key => +key.getAttribute("data-key") === e.key.charCodeAt(0))
    if (button)
        button.dispatchEvent(event);
});

function add(a, b)
{
    return a + b;
}

function subtract(a, b)
{
    return a - b;
}

function multiply(a, b)
{
    return a * b;
}

function divide(a, b)
{
    if (b === 0)
        return "That isn't allowed here. No division by zero!";
    else
        return a / b;
}

function operate()
{
    if (onScreen.charAt(onScreen.length - 1) === " " || onScreen == "")
        return;
    isAnswered = true;
    
    
    let parts = onScreen.split(" ");
    let nums = [];
    let ops = [];
    
    // adds addition and subtraction to nums.
    // performs multiplication and division
    for (let i = parts.length - 1; i >= 0; i--)
        if (+parts[i] || parts[i] === "0")
            nums.push(+parts[i])
        else if ("+-".includes(parts[i]))
            ops.push(parts[i]);
        else if ("/" === parts[i])
        {
            let dividend = divide(parts[--i], nums.pop());
            if (isNaN(dividend))
            {
                screen.textContent = dividend;
                return;
            }
            nums.push(Math.round(dividend * 10000) / 10000);
        }
        else
            nums.push(multiply(parts[--i], nums.pop()));
         
    //performs addition and subtraction.
    while (nums.length > 1)
    {
        let op = ops.pop();
        if (op === "-")
            nums.push(subtract(nums.pop(), nums.pop()));
        else
            nums.push(add(nums.pop(), nums.pop()));
    }
    screen.textContent = nums[0];
    onScreen = nums[0];
}

function writeDigit (e)
{
    if (e.target.textContent === "." && !isDotAllowed())
        return;
    if (isAnswered)
    {
        isAnswered = false;
        screen.textContent = e.target.textContent;
    }
    else
        screen.textContent += e.target.textContent;
    onScreen = screen.textContent;
}

function writeOperator(e)
{
    if (isAnswered)
    {
        isAnswered = false;
        screen.textContent = "";
    }
    else if (onScreen !== "" && onScreen.charAt(onScreen.length - 1) !== " ")
        screen.textContent += " " + e.target.textContent + " ";
    onScreen = screen.textContent;
}

function clear()
{
    if (isAnswered)
    {
        screen.textContent = "";
        onScreen = screen.textContent;
        isAnswered = false;
    }
    else
    {
        let lastCharacter = onScreen.charAt(onScreen.length -1)
        if (lastCharacter === " ")
            onScreen = onScreen.substring(0, onScreen.length - 3);
        else
            onScreen = onScreen.substring(0, onScreen.length - 1);
        screen.textContent = onScreen;
    }
}

function isDotAllowed()
{
    let place = onScreen.lastIndexOf(" ");
    if (place === -1)
        return !onScreen.includes(".");
    else
        return !onScreen.includes(".", place);
}
