/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * @author Gerd Wagner
 */
function NoConstraintViolation() {
  this.message = "";
};
function ConstraintViolation( msg, culprit) {
  this.message = msg;
  if (culprit) this.culprit = culprit;
};

function MandatoryValueConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
MandatoryValueConstraintViolation.prototype = Object.create( ConstraintViolation.prototype);
MandatoryValueConstraintViolation.prototype.constructor = MandatoryValueConstraintViolation;

function RangeConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
RangeConstraintViolation.prototype = Object.create( ConstraintViolation.prototype);
RangeConstraintViolation.prototype.constructor = RangeConstraintViolation;

function IntervalConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
IntervalConstraintViolation.prototype = Object.create( ConstraintViolation.prototype);
IntervalConstraintViolation.prototype.constructor = IntervalConstraintViolation;

function PatternConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
PatternConstraintViolation.prototype = Object.create( ConstraintViolation.prototype);
PatternConstraintViolation.prototype.constructor = PatternConstraintViolation;

function UniquenessConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
UniquenessConstraintViolation.prototype = Object.create( ConstraintViolation.prototype);
UniquenessConstraintViolation.prototype.constructor = UniquenessConstraintViolation;

function OtherConstraintViolation( msg, culprit) {
  ConstraintViolation.call( this, msg, culprit);
};
OtherConstraintViolation.prototype = Object.create( ConstraintViolation.prototype);
OtherConstraintViolation.prototype.constructor = OtherConstraintViolation;
