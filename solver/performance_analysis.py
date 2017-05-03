import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as mpatches

l = (80, 50, 0)

N = 3


ind = np.arange(N) 
width = 0.35       
men_std = (1, 1, 1)

rects1 = plt.bar(ind, l, width, color='r', edgecolor='black')

plt.title('Performance of Sudoku Solver with Different Types of Images')
obj = ['Very\nClear', 'Clear', 'Unclear']
y_pos = np.arange(len(obj))
plt.xticks(y_pos, obj)

def autolabel(rects):
    """
    Attach a text label above each bar displaying its height
    """
    for rect in rects:
        height = rect.get_height()
        plt.text(rect.get_x() + rect.get_width()/2., 1.05*height,
                '%d' % int(height),
                ha='center', va='bottom')

autolabel(rects1)

axes = plt.gca()
axes.set_ylim([0,100])
axes.set_axisbelow(True)
axes.yaxis.grid(color='black')
axes.xaxis.grid(False)

red_patch = mpatches.Patch(color='r', label='Success Rate')
plt.legend(handles=[red_patch], bbox_to_anchor=(1.32, 0.5))

plt.show()