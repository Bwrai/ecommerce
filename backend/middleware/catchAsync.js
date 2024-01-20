const catchAsyncErrors = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next)
}
export default catchAsyncErrors;


// WE COULD USE THIS SYNTAX TOO...
// const catchAsyncc = func => {
//     return (req, res, next) => {
//         func(req, res, next).catch(next);
//     }
// }