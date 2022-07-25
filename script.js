/* DESCRIPTION: HERE WE HAVE THE MIN-HEAP IMPLEMENTATION */
class MinHeap {
	constructor() {
		this.heap_array = [];
	}

	// returns the size of our min heap
	size() {
		return this.heap_array.length;
	}

	// checks whether our heap is empty or not 
	empty() {
		return (this.size() === 0);
	}

	// returns the top element (smallest value element)
	top() {
		return this.heap_array[0];
	}
	
	// inserts a new value into the heap 
	push(value) {
		this.heap_array.push(value);
		this.up_heapify();
	}

	// deletes the top-most element (minimum) -> take the last value -> put it at the root -> perform down_heapify()
	pop() {
		if (this.empty() == false) {
			var last_index = this.size() - 1;
			this.heap_array[0] = this.heap_array[last_index];
			this.heap_array.pop();
			this.down_heapify();
		}
	}

	// updates heap by up heapifying -> maintains the min-heap property by putting the minimum element at the root (when new data is inserted)
	up_heapify() {
		var current_index = this.size() - 1;
		while (current_index > 0) {
			var current_element = this.heap_array[current_index];
			var parent_index = Math.trunc((current_index - 1) / 2);
			var parent_element = this.heap_array[parent_index];

			if (parent_element[0] < current_element[0]) {  // WHY [0]? 
				break;
			}
			else {
				this.heap_array[parent_index] = current_element;
				this.heap_array[current_index] = parent_element;
				current_index = parent_index;
			}
		}
	}

	// updates heap by down heapifying -> there can be 3 cases -
	down_heapify() {
		var current_index = 0;
		var current_element = this.heap_array[0];
		while (current_index < this.size()) {
			var child_index1 = (current_index * 2) + 1;
			var child_index2 = (current_index * 2) + 2;

			// case-1: when none of the children exist -> simply break the loop
			if (child_index1 >= this.size() && child_index2 >= this.size()) {
				break;
			}

			// case-2: when the right child doesn't exist -> we take the left child, and perfrom the swapping (if the child has lesser value)
			else if (child_index2 >= this.size()) {
				let child_element1 = this.heap_array[child_index1];
				if (current_element[0] < child_element1[0]) {
					break;
				}
				else {
					this.heap_array[child_index1] = current_element;
					this.heap_array[current_index] = child_element1;
					current_index = child_index1;
				}
			}

			// case-3: when both the children exist -> we have to take the minimum among them, and if the minimum is smaller than the parent then we do the swapping
			else {
				var child_element1 = this.heap_array[child_index1];
				var child_element2 = this.heap_array[child_index2];
				if (current_element[0] < child_element1[0] && current_element[0] < child_element2[0]) {
					break;
				}
				else {
					if (child_element1[0] < child_element2[0]) {
						this.heap_array[child_index1] = current_element;
						this.heap_array[current_index] = child_element1;
						current_index = child_index1;
					}
					else {
						this.heap_array[child_index2] = current_element;
						this.heap_array[current_index] = child_element2;
						current_index = child_index2;
					}
				}
			}
		}
	}
}





// coder decoder class
class Codec {
	/*THIS ONE IS A BIT TRICKY -
	-> while working on the minHeap with the Huffman Algo (for building the tree like structure), we created a nested format 
	   (you can visualize it better if simply take a few freq-char pairs and DRY RUN the tree building part), so, in order to get 
	   all the values with their corresponding codes we need to perform DFS, 
	   where the base condition will be - when we find a leaf node, i.e.- if the value at the 2nd position (inside pair) is of type 'string',
	   because in other cases we inserted pair of pair of pair and so on
	
	-> FOR THE RECURSIVE CALLS- we have two choices, either we can go for the first element of the pair, or the 2nd element
	   When we go for the first element we basically move on the left child of the tree, so we concatenate '0' to the code, 
	   otherwise we concat '1' (as per the algorithm), and we send the corresponding nodes (node[1][0], or node[1][1]) for the new call
	 */
	getCodes(node, curr_code) { 
		if (typeof (node[1]) === "string") {
			this.codes[node[1]] = curr_code;
			return;
		}

		this.getCodes(node[1][0], curr_code + '0');  // move left 
		this.getCodes(node[1][1], curr_code + '1');  // move right
	}

	// DOUBT! I know we are doing it so that we can store this in compressed file in a certain format, so that we can decompress it again, BUT I need to check the decompression code to know it better
	make_string(node) {
		if (typeof (node[1]) === "string") {
			return "'" + node[1];
		}
		return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
	}

	// It converts the tree_string into huffman_tree (I'M NOT CLEAR ABOUT THE CODE!)
	make_tree(tree_string) {
		let node = [];
		if (tree_string[this.index] === "'") {
			this.index++;
			node.push(tree_string[this.index]);
			this.index++;
			return node;
		}
		this.index++; 
		node.push(this.make_tree(tree_string)); // find and push left child
		this.index++;   
		node.push(this.make_tree(tree_string)); // find and push right child
		return node; 
	}



	// FUNCTION FOR PERFORMING THE 'ENCODING'
	encode(data) {
		this.heap = new MinHeap();

		// counting and mapping the frequencies of each character -> if it was already in our map, we take the mapped value, and add 1 to it -> otherwise we set 1 as its frequency
		var mp = new Map(); 
		for (let i = 0; i < data.length; i++) {
			if (mp.has(data[i])) { 
				let foo = mp.get(data[i]);
				mp.set(data[i], foo + 1);
			}
			else {
				mp.set(data[i], 1);
			}
		}

		// when an empty file was uploaded -> we make the final string "zer#" for the seperation purpose
		if (mp.size === 0) {
			let final_string = "zer#";
			
			let output_message = "Compression complete and file sent for download. " + '</br>' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
			return [final_string, output_message];
		}

		// when a file was sent containing only one character multiple times -> we don't unnecessarily compress the file -> rather, we take the character and the frequency of it and put it in this format -> one#a#41 (in case we had a file containing 'a' 41 times)
		if (mp.size === 1) {
			let key, value;
			for (let [k, v] of mp) {
				key = k;
				value = v;
			}
			let final_string = "one" + '#' + key + '#' + value.toString();
			let output_message = "Compression complete and file sent for download. " + '</br>' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
			return [final_string, output_message];
		}

		// if above two cases fail, we store all the 'frequency-character' pairs in our minHeap 
		for (let [key, value] of mp) {
			this.heap.push([value, key]);
		} 

		// now we take two minimum values, add them and create the tree in this way (Huffman Algo)
		while (this.heap.size() >= 2) {
			let min_node1 = this.heap.top();
			this.heap.pop();
			let min_node2 = this.heap.top();
			this.heap.pop();
			this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);  // NOTE: each time er are just nesting up the 2nd value of the two nodes, and then pushing it back ->  [min_node1, min_node2] this will make a nested format of pairs
		}

		// now we are left with the root node only -> so we traverse the tree and form the code for each character and store them in the object - "codes"
		var huffman_tree = this.heap.top(); 
		this.heap.pop();
		this.codes = {};  
		this.getCodes(huffman_tree, "");

		// hence we have code for each character, so we replace the characters (present in the given input) by their respective codes
		let binary_string = "";
		for (let i = 0; i < data.length; i++) {
			binary_string += this.codes[data[i]];
		}

		// Why padding? Because in the next step we are gonna divide the whole code into 8bit sequences, and from there we will take the corresponding characters for UNICODES formed by each 8bits 
		// -> WE MUST CARRY A COPY OF IT, OTHEREISE WE WON'T BE ABLE TO DECOMPRESS IT AGAIN 
		let padding_length = (8 - (binary_string.length % 8)) % 8;
		for (let i = 0; i < padding_length; i++) {
			binary_string += '0';
		}

		// we are taking 8 bit each time, converting it into integer, taking it as UNICODE, and concatenating the corresponding CHARACTER into 'encoded_data' 
		let encoded_data = "";
		for (let i = 0; i < binary_string.length;) {
			let curr_num = 0;
			for (let j = 0; j < 8; j++, i++) {
				curr_num *= 2;
				curr_num += binary_string[i] - '0';
			}
			encoded_data += String.fromCharCode(curr_num);  // 255 is the maximum value that we can have with 8 bits, and fromCHarCode() helps us to get corresponding character for each UNICODE
		}

		let tree_string = this.make_string(huffman_tree);
		let ts_length = tree_string.length;
		let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
		let output_message = "Compression complete and file sent for download! " + '</br>' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
		return [final_string, output_message];
	}




	//FUNCTION FOR PERFORMING THE 'DECODING'
	decode(data) {
		let k = 0;
		let temp = "";
		while (k < data.length && data[k] != '#') {
			temp += data[k];
			k++;
		}

		// we must encounter '#' before we reach the end of data (that's how we compressed data before)
		if (k == data.length){
			alert("Invalid File!\nPlease submit a valid compressed .txt file to decompress! \n Try again!");
			location.reload();  // reloads the current page 
			return;
		}

		// if we got the string "zer" before the first '#' that means it was an empty file, so we simply return an empty file
		if (temp === "zer") { 
			let decoded_data = "";
			let output_message = "Decompression complete and file sent for download.";
			return [decoded_data, output_message];
		}

		// if the file (before compression) was containg a single character only -> we fetch the character and the frequency, and by repeatedly adding the character we generate the decompressed file
		if (temp === "one") {
			data = data.slice(k + 1);  // extracting the part after the first '#' -> 1 is added to 'k', because we want to ignore the '#'
			k = 0;
			temp = "";

			// now we again scan the data, and collect the chracater that was there (before compression)
			while (data[k] != '#') {
				temp += data[k];
				k++;
			}
			let one_char = temp;
			data = data.slice(k + 1);  // we again extract the part after the 2nd '#' -> now we are remaining with the frequency only -> so we convert it into integer and generate the decompressed file  by repeatedly adding the 'one_char' 'str_len times
			let str_len = parseInt(data); 
			let decoded_data = "";
			for (let i = 0; i < str_len; i++) {
				decoded_data += one_char;
			}
			let output_message = "Decompression complete and file sent for download.";
			return [decoded_data, output_message];
		}

		// if the above two cases fail-> that means the value that we got before the first '#' it is the tree_string length -> so we store it
		let ts_length = parseInt(temp);  
		data = data.slice(k + 1); // we remove the part before the first '#' (including the '#')
		k = 0;
		temp = "";
		while (data[k] != '#') {
			temp += data[k];
			k++;
		}

		// the value that we got before the 2nd '#' it's the padding length -> so we store it
		let padding_length = parseInt(temp);
		data = data.slice(k + 1);

		// now we collect the tree_string part from the encoded data, and store it in 'tree_string'
		temp = ""; 
		for (k = 0; k < ts_length; k++) {
			temp += data[k];
		}
		let tree_string = temp;
		data = data.slice(k);

		// now we collect the 'encoded_data' and store it 
		temp = "";
		for (k = 0; k < data.length; k++) {
			temp += data[k];
		}
		let encoded_data = temp;

		// now we generate the 'huffman_tree' using the 'tree_string' (the reverse one was done while encoding)
		this.index = 0;
		var huffman_tree = this.make_tree(tree_string); 

		// now we retrieve the 'binary_string' from the 'encoded_data'
		let binary_string = "";
		for (let i = 0; i < encoded_data.length; i++) {
			let curr_num = encoded_data.charCodeAt(i);  // while encoding we were taking corresponding character for UNICODES -> now we take the unicodes for corresponding characters

			// we stored the UNICODE of the current character in 'curr_num' -> now we need the binary format of this code (because that are the code for all our characters present in the given file) -> so we do the following-
			let curr_binary = ""; 
			for (let j = 7; j >= 0; j--) {
				let foo = curr_num >> j;
				curr_binary = curr_binary + (foo & 1);  // we do the right-shifting on 'curr_binary' 7 times, 6 times, 5 times and so on till 0, and then we take the & with 1, so that we can check which bits are set and which are not
			} 
			binary_string += curr_binary;
		}

		// as we have collected the binary format, so we don't need the padding anymore -> we need to remove it, so that we can get the actual code for the last character
		binary_string = binary_string.slice(0, -padding_length);

		//now as we have 'huffman_tree' and 'binary_string' we'll use these for the decoding
		let decoded_data = "";
		let node = huffman_tree;
		for (let i = 0; i < binary_string.length; i++) {
			if (binary_string[i] === '1') node = node[1]; // 1 (in binary_string) represents the right edge (child), so we move right
			else node = node[0]; // 0 represents left child, so move left

			if (typeof (node[0]) === "string") { // when we encounter a leaf node, we just concatenate it with our 'decoded_data', and more importantly- we start traversing again from the root node
				decoded_data += node[0];
				node = huffman_tree;  // NOTE: We again start traversing from the root node ( but for different 'i')
			}
		}
		let output_message = "Decompression complete and file sent for download.";
		return [decoded_data, output_message];
	}
}



// Fires immediately after the browser loads the object
window.onload = function () {
	// console.log("here onload");

	// accessing dom elements
	decodeBtn = document.getElementById("decode");
	encodeBtn = document.getElementById("encode");
	fileForm = document.getElementById("fileform");
	uploadFile = document.getElementById("uploadfile")
	submitBtn = document.getElementById("submitbtn");
	step1 = document.getElementById("step1");
	step2 = document.getElementById("step2");
	step3 = document.getElementById("step3");
	

	isSubmitted = false;
	codecObj = new Codec();

	// when submit button is clicked, we do the following - 
	submitBtn.onclick = function () {
		var uploadedFile = uploadFile.files[0];  // receive the file
		if (uploadedFile === undefined) {  // check whether the file is uploaded or not
			alert("No file uploaded!\nPlease upload a valid .txt file and try again!");
			return;
		}

		let nameSplit = uploadedFile.name.split('.'); // Returns an Array of strings -> It splits at each point where the separator occurs in the given string
		var extension = nameSplit[nameSplit.length - 1].toLowerCase();  // we take the last (there should be 2 strings BTW) string (the extension) and convert it into lowercase
		if (extension != "txt") {
			alert("Invalid file type (." + extension + ") \nPlease upload a valid .txt file and try again!");
			return;
		}

		alert("File submitted!");
		isSubmitted = true; 
		onclickChanges("Done!! File uploaded !", step1);  // when a valid .txt file is submitted we finally call onClickChanges() to make some changes in DOM
	} 


	// when compress button is clicked we do the following- 
	encodeBtn.onclick = function () {
		// console.log("encode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded! \nPlease upload a file and try again!");
			return;
		}

		if (isSubmitted === false) {
			alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
			return;
		}

		console.log(uploadedFile.size);
		if(uploadedFile.size === 0){
			alert("WARNING: You have uploaded an empty file!\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}else if(uploadedFile.size <= 350){
			alert("WARNING: The uploaded file is very small in size (" + uploadedFile.size +" bytes) !\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
		}else if(uploadedFile.size < 1000){
			alert("WARNING: The uploaded file is small in size (" + uploadedFile.size +" bytes) !\nThe compressed file's size might be larger than expected (compression ratio might be small).\nBetter compression ratios are achieved for larger file sizes!");
		}

		// we make changes on DOM
		onclickChanges("Done!! Your file will be Compressed", step2); 
		onclickChanges2("Hold On!! Your File is being Compressed... ");  // this is shown in step-3 ( when the file is being compressed)

		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [encodedString, outputMsg] = codecObj.encode(text); 
			myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.txt", encodedString);
			ondownloadChanges(outputMsg);
		} 
		fileReader.readAsText(uploadedFile, "UTF-8");
	}


	// when de-compress button is clicked 
	decodeBtn.onclick = function () { 
		// console.log("decode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}

		if (isSubmitted === false) {
			alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
			return;
		}

		// we make a few changes on DOM, so that we can display necesary messages to the use when the decompression is under process
		onclickChanges("Done!! Your file will be De-compressed", step2);
		onclickChanges2("Hold On!! Your File is being De-Compressed... ");

		var fileReader = new FileReader(); 
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [decodedString, outputMsg] = codecObj.decode(text);
			myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedString);
			ondownloadChanges(outputMsg);
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
	}
}


// we make changes on the element received as arguement-2 -> display a 'done' image and the 'firstMsg'
function onclickChanges(firstMsg, step) {
	step.innerHTML = "";

	let img = document.createElement("img");
	img.src = "assets/done.png";
	img.id = "doneImg";
	step.appendChild(img);

	var br = document.createElement("br");
	step.appendChild(br);

	let msg = document.createElement("span");
	msg.className = "text2";
	msg.innerHTML = firstMsg;
	step.appendChild(msg);
}


// we call this function when the file is under compression/de-compression, so that we can display necessary messages
function onclickChanges2(secMsg) {
	// disable the encode and decode button 
	decodeBtn.disabled = true;
	encodeBtn.disabled = true;

	step3.innerHTML = "";

	let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = secMsg;
	step3.appendChild(msg2);

	var br = document.createElement("br");
	step3.appendChild(br);

	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = " File will be automatically downloaded after the processing is done!";
	step3.appendChild(msg3);
}

/// function to download file
function myDownloadFile(fileName, text) {
	let a = document.createElement('a');
	a.href = "data:application/octet-stream," + encodeURIComponent(text);
	a.download = fileName;
	a.click();
}


// when we are done with step-3, we display the output message and a 'done' image
function ondownloadChanges(outputMsg) { 
	step3.innerHTML = "";

	let img = document.createElement("img");
	img.src = "assets/done.png";
	img.id = "doneImg";
	step3.appendChild(img);

	var br = document.createElement("br");
	step3.appendChild(br);

	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = outputMsg;
	step3.appendChild(msg3); 
}


$("form").on("change", ".file-upload-field", function(){ 
    $(this).parent(".file-upload-wrapper").attr("data-text",         $(this).val().replace(/.*(\/|\\)/, '') );
});