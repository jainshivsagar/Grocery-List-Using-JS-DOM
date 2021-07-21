console.log(counter());

function getCounter(x) {
  return function () {
    x = x + 1;
    return x;
  };
}

const counter = getCounter(0);

console.log(counter());
console.log(counter());
console.log(counter());
console.log(counter());
console.log(counter());
console.log(counter());
