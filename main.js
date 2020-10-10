import { Meteor } from "meteor/meteor";
Resolutions = new Mongo.Collection('resolutions');




Meteor.startup(() => {

    ServiceConfiguration.configurations.remove({
        service: "facebook",
    });

    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: '2717093631846857',
        secret: '991b96b5de9136d3af675723a76667bc'
    });

});
// code to run on server at startup
Meteor.methods({
    addResolution: function (title) {
        Resolutions.insert({
            title: title,
            createdAt: new Date(),
            owner: Meteor.userId()

        });
    },
    updateResolution: function (id, checked) {
        var res = Resolutions.findOne(id);

        if (res.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Resolutions.update(id, { $set: { checked: checked } });
    },
    deleteResolution: function (id) {
        var res = Resolutions.findOne(id);

        if (res.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Resolutions.remove(id);
    },
    setPrivate: function (id, private) {
        var res = Resolutions.findOne(id);

        if (res.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Resolutions.update(id, { $set: { private: private } });

    }
});


Meteor.publish("resolutions", function () {
    return Resolutions.find({
        $or: [
            { private: { $ne: true } },
            { owner: this.userId }
        ]
    });

});