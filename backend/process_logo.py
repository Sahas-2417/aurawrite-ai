import sys
from pathlib import Path
from PIL import Image
import numpy as np

def process_logo():
    input_path = Path(r"C:\Users\dell\Downloads\ChatGPT Image May 9, 2026, 09_09_02 PM.png")
    output_path = Path(r"c:\Users\dell\Desktop\linkcraft-ai\frontend\src\assets\logo.png")
    
    if not input_path.exists():
        print(f"Error: Could not find {input_path}")
        sys.exit(1)
        
    print("Loading image...")
    img = Image.open(input_path).convert("RGBA")
    
    arr = np.array(img)
    
    print("Removing dark background...")
    # Convert pixels where R, G, B are all very dark (e.g., < 20) to transparent
    # The glowing part will be brighter
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    
    # Calculate perceived luminance or just max RGB
    max_rgb = np.max(arr[:,:,:3], axis=2)
    
    # Threshold for what we consider "background"
    # AI generated glowing logos often have some noise, so let's use a soft threshold
    # Create an alpha channel based on brightness, but cap it so bright parts are fully opaque
    # and very dark parts are fully transparent
    
    new_alpha = np.clip((max_rgb.astype(float) - 15) * 4, 0, 255).astype(np.uint8)
    
    # Also, completely transparent if max_rgb < 15
    arr[:,:,3] = new_alpha
    
    # Now let's find the components to crop out the text
    # The text is usually at the bottom
    # Find all non-transparent pixels
    y_idx, x_idx = np.where(new_alpha > 50)
    
    row_sums = np.sum(new_alpha > 50, axis=1)
    
    filled_rows = np.where(row_sums > 0)[0]
    
    if len(filled_rows) == 0:
        print("Image is empty after background removal!")
        sys.exit(1)
        
    # Find the largest continuous block of filled rows (the logo)
    blocks = []
    current_block = [filled_rows[0]]
    
    for y in filled_rows[1:]:
        if y - current_block[-1] < 15:  # Allow small gaps
            current_block.append(y)
        else:
            blocks.append(current_block)
            current_block = [y]
    blocks.append(current_block)
    
    # The logo is probably the block with the largest height
    largest_block = max(blocks, key=lambda b: max(b) - min(b))
    
    y_min = min(largest_block)
    y_max = max(largest_block)
    
    # Now find x_min and x_max for this block
    logo_alpha = new_alpha[y_min:y_max+1, :]
    y_idx_block, x_idx_block = np.where(logo_alpha > 50)
    
    if len(x_idx_block) == 0:
        print("No pixels found in the selected block.")
        sys.exit(1)
        
    x_min = np.min(x_idx_block)
    x_max = np.max(x_idx_block)
    
    print(f"Cropping to: x={x_min}-{x_max}, y={y_min}-{y_max}")
    
    pad = 20
    x_min = max(0, x_min - pad)
    y_min = max(0, y_min - pad)
    x_max = min(arr.shape[1], x_max + pad)
    y_max = min(arr.shape[0], y_max + pad)
    
    # Crop the numpy array
    cropped_arr = arr[y_min:y_max, x_min:x_max]
    
    cropped = Image.fromarray(cropped_arr, "RGBA")
    
    print(f"Saving to {output_path}...")
    cropped.save(output_path)
    print("Done!")

if __name__ == '__main__':
    process_logo()
