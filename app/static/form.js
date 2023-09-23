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
    // console.log(genericFileName);
    const popup = document.getElementById("popup");
    console.log(popup);

    // Отправлка текста на сервер
    // form1.addEventListener('submit', async function(event) {
     
    //     console.log('submit');
    //     event.preventDefault();

    //     const formData = new FormData(form1);
    //     const textInput = formData.get('textInput');
    //     if (textInput.trim().length < 4){
    //         console.error('запрос короче 4 символов');
    //         document.getElementById('short-message').textContent='Введите минимум 4 буквы';
    //     } else {
    //         // "/req-file/?format=json"
    //         // "/one-string/?format=json"
    //         try {
    //             const response = await fetch("/one-string/?format=json", {
    //                 method: 'POST',
    //                 body: formData
    //             });

    //             if (response.ok) {
    //                 console.log('response получен');
    //                 const data = await response.json();
    //                 // outputDiv.textContent = 'Получен json: ' + JSON.stringify(data, null, 2); // Форматированный вывод JSON
    //                 form1.reset(); // Сбрасываем форму

    //                 // ------------- формируем таблицу -------------
            
                
    //                 let tableHeaders = `
    //                         <div class="row ">
    //                             <h4 style="display: inline">Адрес, который вы ввели - ${textInput}</h4>
                            
    //                             <hr>
    //                         </div>
    //                         <div class="row table-header">
    //                         <div class="col-l">
    //                             Исправленные адреса:
    //                         </div>
    //                         <div class="col-r">
    //                         Score
    //                         </div>
    //                     </div>   `
    //                 let tableContent = [];
                    
    //                 data.forEach(el => {
    //                     tableContent.push(`<div class="row">
    //                     <div class="col-l">
    //                         <div class="bar test" style="width: ${el.value*100}%">
                
    //                         </div>
    //                         <div class="address">
    //                             ${el.address}
    //                         </div>
    //                     </div>
    //                     <div class="col-r">
    //                         ${el.value}
    //                     </div>
    //                 </div>`)
    //                 });
    //                 table.innerHTML = tableHeaders + tableContent.join('');
    //                 // table.style.padding="70px";
    //                 table.classList.remove('invisible');
    //                 // table.classList.add('some-class');
                    
    //                 // ------------ вывод графика ------------
    //                 // let myCanv = document.querySelector('canvas');
    //                 // console.log(myCanv);

    //                 // new Chart(document.getElementById("bar-chart-horizontal"), {
    //                 //     type: 'horizontalBar',
    //                 //     data: {
    //                 //         // labels: data.data.labels,
    //                 //       labels: ["Санкт-Петербург г., Яхтеная ул., 18 д., 16 к., 4 кв.",
    //                 //                "Санкт-Петербург г., Яхтеная ул., 18/16  4 кв.",
    //                 //                "СПБ, улица Яхтеная, 18-16-4 к",
    //                 //                "Санкт-Петербург, ул. Яхтеная, д. 18, кв. 16-4",
    //                 //                "Санкт-Петербург, Яхтеная ул., 18, кв. 16/4"],
                            
    //                 //         // datasets: [{
    //                 //         //     label: "Предсказание",
    //                 //         //     backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
    //                 //         //     data: data.data.datasets[0].data
    //                 //         //  }]

    //                 //       datasets: [
    //                 //         {
    //                 //           label: "Предсказание",
    //                 //           backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
    //                 //           data: [0.97, 0.02, 0.005, 0.003, 0.001]
    //                 //         }
    //                 //       ]
    //                 //     },
    //                 //     options: {
    //                 //       legend: { display: false },
    //                 //       title: {
    //                 //         display: true,
    //                 //         text: 'Наиболее вероятные варианты корректировки адресов'
    //                 //       }
    //                 //     }
    //                 // });
                    
    //                 // ------------------------------------------

    //             } else {
    //                 outputDiv.textContent = 'Ошибка при загрузке файла.';
    //             }
    //         } catch (error) {
    //             console.error('Произошла ошибка:', error);
    //             outputDiv.textContent = 'Произошла ошибка при выполнении запроса.';
    //         }
    //         document.getElementById("bar-chart-horizontal").classList.add('canvas_active');
    //         document.querySelector('.body').classList.add('pb100');
    //     }
    // });
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
        // console.log('sending';
        let formData = new FormData(form2);
        console.log(formData);
        console.log('----');
        formData.append('file', file.files[0]);
        console.log(formData);
       
        // console.log(file.files[0]);
        try {
            const response = await fetch("/upload", {
                method: 'POST',
                headers: {
                    "enctype": "multipart/form-data"
                },                
                body: formData
               
            });

            if (response.ok) {
                console.log('response получен');
                const data = await response.json();
                form2.reset(); // Сбрасываем форму
                console.log(data);
                outputLeft.innerHTML = `<h2>Загруженное видео</h2><br> <video width="320"  controls>
                <source id="genericFileName" src="./test/${data.filename}">
                Ваш браузер не поддерживает видео.
              </video>  <br>   <button type = "submit" class="btn btn-success btn-lg mt-3 mb50">Улучшить качество</button>` ;
              setTimeout(() => {
                console.log("закрываем попап");
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
                        const response = await fetch(`/predict?filename=${data.filename}`, {
                            method: 'POST'
                        //     headers: {
                        //         "enctype": "application/json"
                        //     },                
                        //     body: {
                        //         "filename": '252be71ce77d41ecb1bcc86e914f9f54.mp4'
                        //    }
                    });
                        // showPopup();
                        if (response.ok) {
                            console.log('response 2 получен');
                            const data = await response.json();
                            form2.reset(); // Сбрасываем форму
                            console.log(data);
                            outputLeft.innerHTML = `<h2>Загруженное видео</h2><br> <video width="320"  controls>
                            <source id="genericFileName" src="${data.filename}">
                            Ваш браузер не поддерживает видео.
                          </video>  <br>   <button type = "submit" class="btn btn-success btn-lg mt-3 mb50 enhance">Улучшить качество</button>` ;
                          setTimeout(() => {
                            console.log("закрываем попап");
                            hidePopup(); 
                          }, "1000");
                        }
                     }
                     catch (error) {
                        console.error('Произошла ошибка:', error);
                        outputDiv.textContent = 'Произошла ошибка при выполнении запроса 2';
                    }
                });
                     
            } else {
                output.textContent = 'Ошибка при загрузке файла.';
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
            outputDiv.textContent = 'Произошла ошибка при выполнении запроса.';
        }

    });
    
   
    // Переключение табов
//     tabs.addEventListener('click', (e) => {
      
//         e.preventDefault();
//         form1.reset();
//         form2.reset();
//         fileName.textContent = '';
//         console.log(e.target);
//         allTab.forEach(el => {
//             el.classList.toggle('tab_active');
//         })
//         document.querySelectorAll('form').forEach(el => {
//             el.classList.toggle('hidden');
//         });

//    });
});


