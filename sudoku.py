import time

n = 9
m = int(n**0.5)

def findNextCellToFill(grid, i, j):
    for x in range(i,n):
        for y in range(j,n):
            if grid[x][y] == 0:
                return x,y
    for x in range(0,n):
        for y in range(0,n):
            if grid[x][y] == 0:
                return x,y
    return -1,-1

def isValid(grid, i, j, e):
    rowOk = all([e != grid[i][x] for x in range(n)])
    if rowOk:
        columnOk = all([e != grid[x][j] for x in range(n)])
        if columnOk:
            # finding the top left x,y co-ordinates of the section containing the i,j cell
            secTopX, secTopY = m *(i/m), m *(j/m)
            for x in range(secTopX, secTopX+m):
                for y in range(secTopY, secTopY+m):
                    if grid[x][y] == e:
                        return False
            return True
    return False

def solveSudoku(grid, i=0, j=0):
    i,j = findNextCellToFill(grid, i, j)
    if i == -1:
        return True
    for e in range(1,n+1):
        if isValid(grid,i,j,e):
            grid[i][j] = e
            if solveSudoku(grid, i, j):
                    return True
            # Undo the current cell for backtracking
            grid[i][j] = 0
    return False

read = open("sudoku_input","r")
output = open("sudoku_output","w")
inp = []
for i in read.readlines():
    temp = []
    line = i.split(" ")
    if len(line) == n:
        for j in line:
            temp.append(int(j))
        inp.append(temp)

start = time.time()
solveSudoku(inp)
end = time.time() 

for i in inp:
    for j in i:
        output.write(str(j)+" ")
    output.write("\n")

output.write("\n\n")
output.write("Time Elapsed : " + str(end - start))

read.close()
output.close()