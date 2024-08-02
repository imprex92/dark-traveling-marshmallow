import React, { useState, useEffect } from "react";
import styles from "styles/dialogPopup.module.css";

const DialogPopup = ({ children, show, close }) => {
    const [showDialog, setShowDialog] = useState(show);
    
    useEffect(() => {
        setShowDialog(show);
    }, [show]);
    
    return (
        <div className={`${styles.backdrop} ${showDialog ? styles.showBackdrop : ""}`}>
            <div
            className={`${styles.dialogPopup} ${showDialog ? styles.show : ""}`}
            >
                <div className={styles.dialogContent}>{children}</div>
                <button 
                className={`${styles.closeDialog} dialog-close`}
                onClick={(e) => {
                    if (e.target.classList.contains("dialog-close")) {
                        close();
                    }
                }}
                type="button">
                    Close Dialog
                </button>
            </div>
        </div>
    );
};

export default DialogPopup;

/* Usage example:
    <DialogPopup show={dialogOpen} close={() => setDialogOpen(false)}>
        <h1>Dialog Title</h1>
        <p>This is the content of the dialog.</p>
    </DialogPopup>
*/