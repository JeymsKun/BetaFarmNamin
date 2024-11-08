const [isEditingBio, setIsEditingBio] = useState(false);
const [bio, setBio] = useState(user.bio);
const [tempBio, setTempBio] = useState(bio); 

const handleBioEdit = () => {
    setIsEditingBio(true); 
  
    if (bio === "Your Bio Here...") {
      setTempBio(""); 
    } else {
      setTempBio(bio); 
    }
    setInputHeight(40); 
  };

  const handleUpdateBio = () => {
    if (tempBio !== bio) {
      setConfirmationModalVisible(true); 
    } else {
      Alert.alert("No Changes", "You haven't made any changes to your bio.");
      setIsEditingBio(false); 
    }
  };

  const confirmUpdate = () => {
    if (tempBio.trim() === "") {
      setBio("Your Bio Here..."); 
    } else {
      setBio(tempBio); 
    }

    setIsEditingBio(false); 
    setConfirmationModalVisible(false); 
    Alert.alert("Success", "Your bio has been updated!"); 
  };

  const cancelUpdate = () => {
    setConfirmationModalVisible(false); 
    setIsEditingBio(false); 
    setTempBio(bio); 
  };

//   <View style={styles.allInfoContainer}>
//   <View style={styles.userInfoContainer}>
//     <Text style={styles.name}>{user.name}</Text>
//     <Text style={styles.mobile}>{user.mobile}</Text>
//     <Text style={styles.experience}>{user.experience}</Text>
//   </View>

//   <View style={styles.bioContainer}>
//     <View style={styles.bioHeader}>
//       <Text style={styles.bioLabel}>Bio</Text>
//       {isEditingBio ? (
//         <TouchableOpacity style={styles.updateButton} onPress={handleUpdateBio}>
//           <Text style={styles.update}>Update</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.editButton} onPress={handleBioEdit}>
//           <Text style={styles.edit}>Edit</Text>
//         </TouchableOpacity>
//       )}
//     </View>

//     {isEditingBio ? (
//       <TextInput
//         style={[styles.bioInput, { height: inputHeight }]} 
//         multiline
//         numberOfLines={4}
//         value={tempBio}   
//         onChangeText={setTempBio}  
//         onContentSizeChange={(content) => {
//           setInputHeight(Math.max(40, content.nativeEvent.contentSize.height)); 
//         }}
//         placeholder="Add your bio here..." 
//       />
//     ) : (
//       <Text style={styles.bioText}>{bio}</Text>
//     )}
//   </View>
// </View>


// <Modal
// visible={confirmationModalVisible}
// transparent={true}
// animationType="fade"
// onRequestClose={() => setConfirmationModalVisible(false)}
// >
// <View style={styles.modalContainer}>
//   <View style={styles.confirmationBox}>
//     <Text style={styles.confirmationText}>Are you sure you want to update your bio?</Text>
//     <View style={styles.confirmationButtons}>
//       <TouchableOpacity style={styles.confirmButton} onPress={confirmUpdate}>
//         <Text style={styles.confirmButtonText}>Yes</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.cancelButton} onPress={cancelUpdate}>
//         <Text style={styles.cancelButtonText}>No</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </View>
// </Modal>