import cv2
import numpy as np
from matplotlib import pyplot as pl


def show(img):
    cv2.imshow("IMAGE", img)
    cv2.waitKey(0)
    pass


def rectify(h):
    h = np.vstack(h)
    hnew = np.zeros((4, 2), dtype=np.float32)

    add = h.sum(1)
    hnew[0] = h[np.argmin(add)]
    hnew[2] = h[np.argmax(add)]

    diff = np.diff(h, axis=1)
    hnew[1] = h[np.argmin(diff)]
    hnew[3] = h[np.argmax(diff)]

    return hnew


def train():
    ''' tarin the neural network '''

    samples = np.loadtxt('generalsamples.data', np.float32)
    responses = np.loadtxt('generalresponses.data', np.float32)
    responses = responses.reshape((1, responses.size))

    model = cv2.KNearest()
    model.train(samples, responses)
    return model


image = "sudoku.png"
img = cv2.imread(image)
# size of the image (height, width)
h, w = img.shape[:2]
print h, w
if h > 2000:
    img = cv2.resize(img, (0, 0), fx=0.20, fy=0.20)
h, w = img.shape[:2]
print h, w
show(img)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# show(gray)
# blur = cv2.GaussianBlur(gray, (5, 5), 0)
# show(blur)
thresh = cv2.adaptiveThreshold(
    gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 1, 11, 12)
show(thresh)

# find the countours
contours, hierarchy = cv2.findContours(thresh,
                                       cv2.RETR_LIST,
                                       cv2.CHAIN_APPROX_SIMPLE)

# copy the original image to show the posible candidate
image_sudoku_candidates = img.copy()

'''# biggest rectangle
size_rectangle_max = 0
for i in range(len(contours)):
    # aproximate countours to polygons
    approximation = cv2.approxPolyDP(contours[i], 4, True)
    # print approximation
    # has the polygon 4 sides?
    if(not (len(approximation) == 4)):
        continue
    # is the polygon convex ?
    if(not cv2.isContourConvex(approximation)):
        continue
    # area of the polygon
    size_rectangle = cv2.contourArea(approximation)
    # store the biggest
    if size_rectangle > size_rectangle_max:
        size_rectangle_max = size_rectangle
        big_rectangle = approximation

# show the best candidate
approximation = big_rectangle
for i in range(len(approximation)):
    cv2.line(image_sudoku_candidates,
             (big_rectangle[(i % 4)][0][0], big_rectangle[(i % 4)][0][1]),
             (big_rectangle[((i + 1) % 4)][0][0],
              big_rectangle[((i + 1) % 4)][0][1]),
             (255, 0, 0), 2)

show(image_sudoku_candidates)'''


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

approximation = biggest
for i in range(len(biggest)):
    cv2.line(image_sudoku_candidates,
             (biggest[(i % 4)][0][0], biggest[(i % 4)][0][1]),
             (biggest[((i + 1) % 4)][0][0],
              biggest[((i + 1) % 4)][0][1]),
             (255, 0, 0), 2)

show(image_sudoku_candidates)
'''h = np.array([[0, 0], [449, 0], [449, 449], [0, 449]], np.float32)
retval = cv2.getPerspectiveTransform(approx, h)
warp = cv2.warpPerspective(gray, retval, (450, 450))
out = warp.copy()
final = cv2.warpPerspective(img, retval, (450, 450))
show(final)
warp_gray = out.copy()'''


import numpy as np
IMAGE_WIDHT = 16
IMAGE_HEIGHT = 16
SUDOKU_SIZE = 9
N_MIN_ACTVE_PIXELS = 10
# approximation=approx
# sort the corners to remap the image


def getOuterPoints(rcCorners):
    ar = []
    ar.append(rcCorners[0, 0, :])
    ar.append(rcCorners[1, 0, :])
    ar.append(rcCorners[2, 0, :])
    ar.append(rcCorners[3, 0, :])

    x_sum = sum(rcCorners[x, 0, 0]
                for x in range(len(rcCorners))) / len(rcCorners)
    y_sum = sum(rcCorners[x, 0, 1]
                for x in range(len(rcCorners))) / len(rcCorners)

    def algo(v):
        return (math.atan2(v[0] - x_sum, v[1] - y_sum)
                + 2 * math.pi) % 2 * math.pi
        ar.sort(key=algo)
    return (ar[3], ar[0], ar[1], ar[2])

# point to remap
points1 = np.array([
    np.array([0.0, 0.0], np.float32) + np.array([144, 0], np.float32),
    np.array([0.0, 0.0], np.float32),
    np.array([0.0, 0.0], np.float32) + np.array([0.0, 144], np.float32),
    np.array([0.0, 0.0], np.float32) + np.array([144, 144], np.float32),
], np.float32)
outerPoints = getOuterPoints(approximation)
points2 = np.array(outerPoints, np.float32)

# Transformation matrix
pers = cv2.getPerspectiveTransform(points2,  points1)

# remap the image
warp = cv2.warpPerspective(
    img, pers, (SUDOKU_SIZE * IMAGE_HEIGHT, SUDOKU_SIZE * IMAGE_WIDHT))
warp_gray = cv2.cvtColor(warp, cv2.COLOR_BGR2GRAY)
show(warp_gray)
# IMAGE_WIDHT, IMAGE_HEIGHT, SUDOKU_SIZE, N_MIN_ACTVE_PIXELS = 450, 450, 9, 10


def extract_number(x, y):
    # square -> position x-y
    im_number = warp_gray[
        x * IMAGE_HEIGHT:(x + 1) * IMAGE_HEIGHT][:, y * IMAGE_WIDHT:(y + 1) * IMAGE_WIDHT]

    # threshold
    im_number_thresh = cv2.adaptiveThreshold(im_number, 255, 1, 1, 15, 9)
    # delete active pixel in a radius (from center)
    for i in range(im_number.shape[0]):
        for j in range(im_number.shape[1]):
            dist_center = math.sqrt(
                (IMAGE_WIDHT / 2 - i)**2 + (IMAGE_HEIGHT / 2 - j)**2)
            if dist_center > 6:
                im_number_thresh[i, j] = 0

    n_active_pixels = cv2.countNonZero(im_number_thresh)
    return [im_number, im_number_thresh, n_active_pixels]


def find_biggest_bounding_box(im_number_thresh):
    contour, hierarchy = cv2.findContours(im_number_thresh.copy(),
                                          cv2.RETR_CCOMP,
                                          cv2.CHAIN_APPROX_SIMPLE)

    biggest_bound_rect = []
    bound_rect_max_size = 0
    for i in range(len(contour)):
        bound_rect = cv2.boundingRect(contour[i])
        size_bound_rect = bound_rect[2] * bound_rect[3]
        if size_bound_rect > bound_rect_max_size:
            bound_rect_max_size = size_bound_rect
            biggest_bound_rect = bound_rect
    # bounding box a little more bigger
    x_b, y_b, w, h = biggest_bound_rect
    x_b = x_b - 1
    y_b = y_b - 1
    w = w + 2
    h = h + 2

    return [x_b, y_b, w, h]

import math
import numpy as np

# sudoku representation
sudoku = np.zeros(shape=(9 * 9, IMAGE_WIDHT * IMAGE_HEIGHT))


def Recognize_number(x, y):
    """
    Recognize the number in the rectangle
    """
    # extract the number (small squares)
    [im_number, im_number_thresh, n_active_pixels] = extract_number(x, y)

    if n_active_pixels > N_MIN_ACTVE_PIXELS:
        [x_b, y_b, w, h] = find_biggest_bounding_box(im_number_thresh)

        im_t = cv2.adaptiveThreshold(im_number, 255, 1, 1, 15, 9)
        number = im_t[y_b:y_b + h, x_b:x_b + w]

        if number.shape[0] * number.shape[1] > 0:
            number = cv2.resize(
                number, (IMAGE_WIDHT, IMAGE_HEIGHT), interpolation=cv2.INTER_LINEAR)
            ret, number2 = cv2.threshold(number, 127, 255, 0)
            number = number2.reshape(1, IMAGE_WIDHT * IMAGE_HEIGHT)
            sudoku[x * 9 + y, :] = number
            return 1

        else:
            sudoku[x * 9 + y,
                   :] = np.zeros(shape=(1, IMAGE_WIDHT * IMAGE_HEIGHT))
            return 0

index_subplot = 0
n_numbers = 0
indexes_numbers = []
for i in range(SUDOKU_SIZE):
    for j in range(SUDOKU_SIZE):
        if Recognize_number(i, j) == 1:
            if (n_numbers % 5) == 0:
                index_subplot = index_subplot + 1
            indexes_numbers.insert(n_numbers, i * 9 + j)
            n_numbers = n_numbers + 1

# create subfigures
print index_subplot, indexes_numbers, len(indexes_numbers)
f, axarr = pl.subplots(index_subplot, 5)
width = 0
for i in range(len(indexes_numbers)):
    ind = indexes_numbers[i]
    if (i % 5) == 0 and i != 0:
        width = width + 1
    axarr[i % 5, width].imshow(cv2.resize(sudoku[ind, :].reshape(
        IMAGE_WIDHT, IMAGE_HEIGHT), (IMAGE_WIDHT * 5, IMAGE_HEIGHT * 5)), cmap=pl.gray())
    # cv2.imwrite(ind, sudoku[ind, :])
    axarr[i % 5, width].axis("off")
pl.show()
print "DOne"
'''thresh = cv2.adaptiveThreshold(warp, 255, 1, 1, 11, 12)
digits = ['0' for i in range(81)]
position = []
model = train()
W = 450
H = 450
d = dict()
pos = 0
name = 0
for i in range(9):
    for j in range(9):

        h_start = i * (H / 9)
        h_end = (i + 1) * (H / 9)
        w_start = j * (W / 9)
        w_end = (j + 1) * (W / 9)

        gri = warp[h_start:h_end, w_start:w_end]
        out = gri.copy()

        im = thresh[h_start:h_end, w_start:w_end]
        contours, hierarchy = cv2.findContours(
            im, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        t = 0
        for c in contours:
            if cv2.contourArea(c) > 50:
                [x, y, w, h] = cv2.boundingRect(c)

                if not((25 < h < 40) and (8 < w < 30)):
                    continue

                if (25 < h < 40) and (8 < w < 30):
                    cv2.rectangle(
                        gri, (x, y), (x + w, y + h), (0, 0, 255), 2)

                    n = str(name) + '.jpg'
                    d[n] = pos
                    output = out[y:y + h, x:x + w]
                    cv2.imwrite(n, output)
                    position.append(0)
                    t = 1
                    name += 1
                    pos += 1

        if(t == 0):
            position.append(((w_start) + 15, (h_start) + 42))
            pos += 1
show(final)'''
