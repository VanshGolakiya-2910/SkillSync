// // // let obj = {
// // //     a : {
// // //         b : undefined
// // //     }
// // // }

// // // console.log(obj.a?.b?.c?.d??"jitin")    

// // var abc = 25;
// // if(function f() {}){
// //     abc = abc + typeof f
// // }
// // console.log(abc)


// function mul(a){
//     return function(b){
//         if (b!== undefined) return mul(a*b)
//         return a
//     }
// }

// function reverseString(){
//     const str = 'I am Vansh'
//     let reverseString = []
//     for (let i = 0 ; i < str.length ; i++)
//     {
//         reverseString[str.length-i-1] = str[i]
//     }
//     return reverseString.join("")
// }
// let str = reverseString()
// console.log(str)




// let word = "I am Vansh"
// let reverseFunc = word.split("").reverse().join("")
// console.log(reverseFunc)

// let word = "Vansh";
// let arr = word.split("");

// const checkPalindrome = () => {
//   const len = arr.length;
//   for (let i = 0; i < len / 2; i++) {
//     if (arr[i] !== arr[len - i - 1]) {
//       return "not palindrome";
//     }
//   }
//   return "palindrome";
// }

// console.log(checkPalindrome()); // "not palindrome"

// let arr1 = [100 , 200 ,300, 400]
// let arr2 = [100 , 200, 300 ,400]

// const a  = JSON.stringify(arr1)
// const b = JSON.stringify(arr2)

// console.log(a==b)

// console.log( "" == 0)

// let a = Array(100)
// console.log(a)

console.log([,,,].length)

// const str1 = "Vansh"
// const str2 = "Golakiya"

// function Merge(){
//     str1 = str1.split("")
//     str2 = str2.split("")
// }
