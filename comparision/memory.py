import numpy as np
import matplotlib.pyplot as plt


N = 4
menMeans = (160, 160, 160, 160)
womenMeans = (370, 385, 400, 530)
ind = np.arange(N)    # the x locations for the groups
width = 0.35       # the width of the bars: can also be len(x) sequence

p1 = plt.bar(ind, menMeans, width, edgecolor='black')
p2 = plt.bar(ind, womenMeans, width, color='#d62728', edgecolor='black', bottom=menMeans)


plt.title('Memory Used by Algorithms')
plt.xticks(ind, ('Easy', 'Medium', 'Hard', 'Very Hard'))
#plt.yticks(np.arange(0, 81, 10))
plt.legend((p2[0], p1[0]), ('Dancing Links','Back-Tracking'),bbox_to_anchor=(1.0, 0.5))
axes = plt.gca()
axes.set_ylim([0,800])
axes.set_axisbelow(True)
axes.yaxis.grid(color='black')
axes.xaxis.grid(False)
plt.show()