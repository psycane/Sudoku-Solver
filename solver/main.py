from Image_Processing import *
from solve_sudoku import *
import os
blank = ['0'] * 81


def main(image):
    t = None
    error = None
    start = time.clock()
    try:
        board, position, final_image = image_processing(image)
        if board == blank:
            print 1 / 0
    except:
        return ('Sudoku not recognised!', t)
    print board
    solved_sudoku = solve(board)

    print solved_sudoku
    if(solved_sudoku):
        output = []
        for s in squares:
            output.append(solved_sudoku[s])
        for i in range(len(position)):
            if(position[i] != 0):
                font = cv2.FONT_HERSHEY_SIMPLEX
                cv2.putText(final_image, output[i], position[
                            i], font, 1.1, (0, 255, 0), 2, cv2.CV_AA)

        output = final_image.copy()
        cv2.imwrite('/home/psycane/Sudoku-Solver/uploads/output.jpg', output)
        cv2.imwrite('/home/psycane/Sudoku-Solver/app/static/output.jpg', output)
        # cv2.imshow('output', final_image)
        # cv2.waitKey(0)
        t = time.clock() - start
        return (error, t)

    else:
        return ('Not Solved!', t)

# main('test_images/sudoku1.png')
