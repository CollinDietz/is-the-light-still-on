   // Load the image classifier model
   const classifier = ml5.imageClassifier('MobileNet', { topk: 25 }, modelReady);
   let modelLoaded = false;
   let imageLoaded = false;
   let running = false;

   // When the model is ready, start classifying the image
   function modelReady() {
     console.log('Model Loaded!');
     modelLoaded = true;

     if (imageLoaded && !running) {
       running = true;
       classifyImage();
     }
   }

   function onLoad() {
     imageLoaded = true;
     if (modelLoaded && !running) {
       running = true;
       classifyImage();
     }
   }

   // Classify the captured image to check if the light bulb is on
   function classifyImage() {
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');
     const image = document.getElementById('streamImage');

     canvas.width = image.width;
     canvas.height = image.height;

     ctx.drawImage(image, 0, 0);

     classifier.classify(image, gotResults);
   }

   // Display whether the light bulb is on based on classification
   function gotResults(error, results) {
     if (error) {
       console.error(error);
       document.getElementById('classification').innerText = "Error: " + error;
       return;
     }

     // Check if any of the results contain 'spotlight' or 'spot'
     let lightIsOn = "No"; // Default to "No"
     for (let i = 0; i < results.length; i++) {
       const label = results[i].label.toLowerCase();
       if (label.includes('spotlight') || label.includes('spot')) {
         lightIsOn = "Yes";
         break;
       }
     }

     // Display the result
     const classificationElement = document.getElementById('classification');
     const resultElement = document.getElementById('result');
     classificationElement.innerText = `${lightIsOn}`;
     resultElement.innerText = `${lightIsOn}`;
     classificationElement.style.fontSize = '100px';
     if (lightIsOn === "Yes") {
       classificationElement.style.color = 'green';
       resultElement.style.color = 'green';
     } else {
       classificationElement.style.color = 'red';
       resultElement.style.color = 'red';
     }

     populateTable(results);
   }

   function populateTable(data) {
     const tableBody = document.querySelector("#confidenceTable tbody");
     data.forEach(item => {
       const row = document.createElement("tr");

       // Check if the label includes 'spotlight' or 'spot' to make it noteworthy
       if (item.label.toLowerCase().includes('spotlight') || item.label.toLowerCase().includes('spot')) {
         row.classList.add("noteworthy");
       }

       const labelCell = document.createElement("td");
       labelCell.textContent = item.label;
       const confidenceCell = document.createElement("td");
       confidenceCell.textContent = item.confidence.toFixed(2); // Round the confidence to 2 decimal places
       row.appendChild(labelCell);
       row.appendChild(confidenceCell);
       tableBody.appendChild(row);
     });
   }
