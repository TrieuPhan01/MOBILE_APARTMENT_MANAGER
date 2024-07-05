let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    console.log('Đường dẫn hình ảnh:', result.assets[0].uri);
    
    setSelectedImage(result.assets[0].uri)

    const formData = new FormData();
    formData.append('id', '1'); // Thay thế '123' bằng giá trị id thực tế
    formData.append('avatar', {
      uri: result.assets[0].uri,
      name: 'userProfile.jpg',
      type: 'image/jpge',
    });

    try {
      await axios.post("https://longtocdo107.pythonanywhere.com/users/3/upload_avatar/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(function (response) {
        //handle success
        console.log('Thanh cong')
        console.log(response);
      })
        .catch(function (response) {
          console.log('That bai')
          //handle error
          console.log(response);
        });;

    } catch (error) {
      console.log('Lỗi upload')
    }
  }