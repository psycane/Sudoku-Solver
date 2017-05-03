import matplotlib.pyplot as plt
import numpy as np

a = 100
b = 66
c = 50

l = (a, b, c)

N = 3


ind = np.arange(N) 
width = 0.35       
men_std = (1, 1, 1)
fig, ax = plt.subplots()

rects1 = ax.bar(ind, l, width, color='r', yerr=men_std)


# add some text for labels, title and axes ticks
ax.set_ylabel('Scores out of 100')
ax.set_xlabel('Images')
ax.set_title('Performance of sudoku solver using different types of images')
ax.set_xticks(ind + width / 2)
ax.set_xticklabels(('Very Clear', 'Clear', 'Not Clear'))

def autolabel(rects):
    """
    Attach a text label above each bar displaying its height
    """
    for rect in rects:
        height = rect.get_height()
        ax.text(rect.get_x() + rect.get_width()/2., 1.05*height,
                '%d' % int(height),
                ha='center', va='bottom')

autolabel(rects1)

axes = plt.gca()
axes.set_ylim([0,120])

plt.show()