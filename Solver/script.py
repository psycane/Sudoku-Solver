import cv2
import numpy as np
#import matplotlib.pyplot as plt


def show(im):
    cv2.imshow('Sudoku', im)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def rectify(h):
    h = h.reshape((4,2))
    hnew = np.zeros((4,2),dtype = np.float32)

    add = h.sum(1)
    hnew[0] = h[np.argmin(add)]
    hnew[2] = h[np.argmax(add)]
     
    diff = np.diff(h,axis = 1)
    hnew[1] = h[np.argmin(diff)]
    hnew[3] = h[np.argmax(diff)]

    return hnew

# Read the image
im = cv2.imread('./img/sudoku_test3.png')

# Show image
show(im)

# Convert to grayscale
gray = cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
show(gray)

# GuassianBlur for better thresholding
gray = cv2.GaussianBlur(gray, (5, 5), 0)
show(gray)

# Thresholding - Black becomes blacker and white becomes whiter
thresh = cv2.adaptiveThreshold(gray, 255, 1, 1, 11, 2)
show(thresh)

# Finding out all the contours
contours, hierarchy = cv2.findContours(
    thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# Finding maximum possible square inside the image
biggest = None
max_area = 0
for i in contours:
    area = cv2.contourArea(i)
    if area > 100:
        peri = cv2.arcLength(i, True)
        approx = cv2.approxPolyDP(i, 0.02 * peri, True)
        if area > max_area and len(approx) == 4:
            biggest = approx
            max_area = area

# Rectifying the square for optimal coordinates
approx=rectify(biggest)

# Creating array equalent to maximum size of the image
h = np.array([ [0,0],[489,0],[489,367],[0,367] ],np.float32)

# Taking out the square grid from the grayscale image
retval = cv2.getPerspectiveTransform(approx,h)
warp = cv2.warpPerspective(gray,retval,(490,368))

# Showing the grid
show(warp)


# gray = warp
# edges = cv2.Canny(gray,50,150,apertureSize = 3)
# cv2.imwrite('edges-50-150.jpg',edges)
# minLineLength=100
# lines = cv2.HoughLinesP(image=edges,rho=1,theta=np.pi/180, threshold=100,lines=np.array([]), minLineLength=minLineLength,maxLineGap=80)

# a,b,c = lines.shape
# for i in range(a):
#     cv2.line(gray, (lines[i][0][0], lines[i][0][1]), (lines[i][0][2], lines[i][0][3]), (0, 0, 255), 3, cv2.LINE_AA)
#     cv2.imwrite('houghlines5.jpg',gray)

edges = cv2.Canny(warp,50,150,apertureSize = 3)

lines = cv2.HoughLines(edges,1,np.pi/180,200)
for rho,theta in lines[0]:
    a = np.cos(theta)
    b = np.sin(theta)
    x0 = a*rho
    y0 = b*rho
    x1 = int(x0 + 1000*(-b))
    y1 = int(y0 + 1000*(a))
    x2 = int(x0 - 1000*(-b))
    y2 = int(y0 - 1000*(a))

    cv2.line(warp,(x1,y1),(x2,y2),(255,255,255),2)
show(warp)
cv2.imwrite('no_grid.jpg',warp)