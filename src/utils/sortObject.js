
const sortObject = (obj) => {
	
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
		
    return sorted;
}
export default sortObject

// const sortObject = (obj) => {
//   const sorted = {};
//   const keys = Object.keys(obj).sort(); // chỉ sort key, KHÔNG encode
//   for (const key of keys) {
//     sorted[key] = obj[key]; // giữ nguyên value gốc
//   }
//   return sorted;
// };

// export default sortObject
