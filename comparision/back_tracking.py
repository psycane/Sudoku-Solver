import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as mpatches


l = [32, 40, 48, 108]

N = 4


ind = np.arange(N) 
width = 0.35       

rects1 = plt.bar(ind, l, width, color='b', edgecolor='black')
axes = plt.gca()
axes.set_ylim([0,120])
axes.set_axisbelow(True)
axes.yaxis.grid(color='black')
axes.xaxis.grid(False)


# add some text for labels, title and axes ticks
plt.title('Back-Tracking')
obj = ['Easy', 'Medium', 'Hard', 'Very\nHard']
y_pos = np.arange(len(obj))
plt.xticks(y_pos, obj)

red_patch = mpatches.Patch(color='b', label='Back-Tracking')
plt.legend(handles=[red_patch], bbox_to_anchor=(1.5, 0.5))

plt.show()