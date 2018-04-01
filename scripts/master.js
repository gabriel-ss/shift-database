let shiftTable = new ShiftTable();
shiftTable.updateTable();


//Closes the modal when clicking outside it
document.querySelector(".overlay").addEventListener("click", (event) => {
	if (event.target == document.querySelector(".overlay"))
		document.querySelector(".overlay").style = "display: none";
});
