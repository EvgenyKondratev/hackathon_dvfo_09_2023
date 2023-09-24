console.log('hi from form.js');

document.addEventListener('DOMContentLoaded', function() {
    let body = document.querySelector('.body');
    const form2 = document.getElementById('upload-file');
    const file = document.getElementById('fileToUpload');
    const fileChooseButton = document.getElementById('file-choose-button');
    const fileSendButton = document.getElementById('file-send-button');
    const outputDiv = document.getElementById('output');
    const outputLeft = document.querySelector('.output-left');
    const outputRight = document.querySelector('.output-right');
    const table = document.querySelector('.table');
    const fileName = document.getElementById('fileName');
    const tabs = document.querySelector('.tabs');
    const allTab = document.querySelectorAll('.tab');
    const genericFileName = document.getElementById('genericFileName');
    const popup = document.getElementById("popup");
  

    // Выбор файла 
    fileChooseButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('fileToUpload').click();
    });
    // Отображение имени файла
    form2.addEventListener('change', e => {
        e.preventDefault();
        console.log(file.files[0].name);
        document.getElementById('fileName').textContent = file.files[0].name;
    });
     // Отправка файла на сервер
     form2.addEventListener('submit', async function(event) {
        console.log('submit');
        event.preventDefault();
        fileName.textContent = '';
        let formData = new FormData(form2);
        // console.log(formData);
        // console.log('----');
        formData.append('file', file.files[0]);
        // console.log(formData);
       
        try {
            const response = await fetch("/upload", {
                method: 'POST',
                headers: {
                    "enctype": "multipart/form-data"
                },                
                body: formData
               
            });
            showPopup();

            if (response.ok) {
                console.log('response получен');
                const data = await response.json();
                form2.reset(); // Сбрасываем форму
                console.log(data);
                outputLeft.innerHTML = `<h2>Загруженное видео</h2><br> <video width="600"  controls>
                <source id="genericFileName" src="./test/${data.filename}">
                Ваш браузер не поддерживает видео.
              </video>  <br>   <button type = "submit" class="btn btn-success btn-lg mt-3 mb50 enhance">Улучшить качество</button>` ;
              setTimeout(() => {
                console.log("закрываем попап 1");
                hidePopup(); 
              }, "1000");
            // document.getElementById('genericFileName').src = `./test/${data.filename}`;
            
                outputDiv.classList.remove('invisible');
                const enhance = document.querySelector('.enhance');
                console.log(enhance);


                // пробуем второй запрос
                enhance.addEventListener('click', async function(event){
                    event.preventDefault();
                    try {
                        console.log('post-запрос №2');
                        console.log(data.filename);
                        showPopup();
                        // let finalName = data.filename.split('');
                        // console.log('появился массив', finalName);
                        // let arr2 = finalName.slice(0, -8);
                        // let str = arr2.join('');
                        // str += '.mp4';
                        // console.log(typeof str, str);
                       

                        const response = await fetch(`/predict?filename=${data.filename}`, {
                            method: 'POST'
                   
                    });
                        // showPopup();
                        if (response.ok) {
                            console.log('response 2 получен');
                            const data = await response.json();
                            
                            console.log('data.filename из data2 = ', data.filename);
                            // console.log(typeof data.filename);
                         

                            outputRight.innerHTML = `<h2>Улучшенное видео</h2><br> <video width="600"  controls >
                            <source id="genericFileName" src="${data.filename}" type="video/mp4">
                            Ваш браузер не поддерживает видео.
                          </video>  <br>   <button type = "submit" class="btn btn-success btn-lg mt-3 mb50 enhance">Мне понравилось! :)</button>` ;
                      
                            console.log("закрываем попап");
                            hidePopup(); 
                        
                        }
                     }
                     catch (error) {
                        console.error('Произошла ошибка:', error);
                        outputDiv.textContent = 'Произошла ошибка при выполнении запроса 2';
                    }
                });
                     
            } else {
                output.textContent = 'Ошибка при загрузке файла.';
                hidePopup();
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
            outputDiv.textContent = 'Произошла ошибка при выполнении запроса.';
        }

    });
    
   

});



// Функция для отображения всплывающего окна
function showPopup() {
  popup.style.display = "block";
}

// Функция для скрытия всплывающего окна
function hidePopup() {
  popup.style.display = "none";
}