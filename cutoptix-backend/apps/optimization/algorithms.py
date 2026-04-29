"""
Cutting Stock Problem Solver using First-Fit Decreasing Algorithm
"""


class BarBuffer:
    """Represents a material bar with remaining space"""
    
    def __init__(self, bar_length, bar_id=None):
        self.total_length = bar_length
        self.bar_id = bar_id
        self.remaining_space = bar_length
        self.used_length = 0
        self.cuts = []
    
    def can_fit(self, cut_length):
        """Check if cut can fit in remaining space"""
        return cut_length <= self.remaining_space
    
    def add_cut(self, cut_length, design_id):
        """Add a cut to the bar"""
        if self.can_fit(cut_length):
            self.cuts.append({'length': cut_length, 'design_id': design_id})
            self.remaining_space -= cut_length
            self.used_length += cut_length
            return True
        return False
    
    def get_efficiency(self):
        """Calculate cutting efficiency"""
        if self.total_length > 0:
            return (self.used_length / self.total_length) * 100
        return 0
    
    def get_waste(self):
        """Get waste amount"""
        return self.total_length - self.used_length


class CuttingOptimizer:
    """Cutting stock problem solver using first-fit decreasing algorithm"""
    
    def __init__(self, bar_length, designs):
        self.bar_length = bar_length
        # Sort designs by material_length in descending order (First-Fit Decreasing)
        self.designs = sorted(
            designs, key=lambda x: float(x.material_length), reverse=True
        )
        self.bars = []
        self.waste_total = 0
    
    def optimize(self):
        """Run optimization algorithm"""
        for design in self.designs:
            placed = False
            cut_length = float(design.material_length)
            
            # Try to fit in existing bars
            for bar in self.bars:
                if bar.can_fit(cut_length):
                    bar.add_cut(cut_length, design.id)
                    placed = True
                    break
            
            # Create new bar if couldn't fit
            if not placed:
                new_bar = BarBuffer(self.bar_length)
                new_bar.add_cut(cut_length, design.id)
                self.bars.append(new_bar)
        
        self.calculate_efficiency()
        return self.get_result()
    
    def calculate_efficiency(self):
        """Calculate cutting efficiency and waste"""
        for bar in self.bars:
            self.waste_total += bar.get_waste()
    
    def get_result(self):
        """Return optimization result"""
        if len(self.bars) == 0:
            avg_efficiency = 0
        else:
            avg_efficiency = sum(b.get_efficiency() for b in self.bars) / len(self.bars)
        
        return {
            'bars': self.bars,
            'total_waste': self.waste_total,
            'average_efficiency': avg_efficiency,
            'bars_needed': len(self.bars)
        }
