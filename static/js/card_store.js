document.getElementById("kawaiiForm").addEventListener("submit", function(event){
    event.preventDefault();
    
    let formData = new FormData(this);
    
    fetch("/submit_form", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("startButton").style.backgroundImage = `url('${data.new_button_image}')`;
            alert("提交成功！");
        } else {
            alert("提交失败，请重试！");
        }
        // 关闭表单
        let modal = bootstrap.Modal.getInstance(document.getElementById('kawaiiFormModal'));
        modal.hide();
    })
    .catch(error => console.error('Error:', error));
});


